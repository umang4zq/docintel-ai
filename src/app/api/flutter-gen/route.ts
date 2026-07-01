import { NextResponse } from "next/server";
import JSZip from "jszip";

const NIM_API_KEY = process.env.NVIDIA_API_KEY;

// 1. OCR Stage
async function runOCR(imageBase64: string) {
  const res = await fetch("https://ai.api.nvidia.com/v1/cv/nvidia/nemotron-ocr-v2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NIM_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      input: [{ type: "image_url", url: imageBase64 }]
    })
  });
  if (!res.ok) throw new Error(`OCR failed: ${res.status} - ${await res.text()}`);
  return await res.json();
}

// 2. Vision Mapping Stage
async function runVisionMapping(imageBase64: string, ocrData: any) {
  const prompt = `Given this screenshot and its OCR analysis: ${JSON.stringify(ocrData)}
Map every detected element to its Flutter widget equivalent.
Use only standard Flutter material widgets.
Output a strict widget_tree JSON where each node has:
{ "widget": "WidgetName", "props": {}, "children": [], "riverpod_provider": null | "providerName" }
Identify which elements need state (forms, async lists, toggles).
Assign riverpod provider names using camelCase + Provider suffix.
Return ONLY valid JSON.`;

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NIM_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-4-31b-it",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 4096,
      temperature: 0.2,
      top_p: 0.95,
      chat_template_kwargs: { enable_thinking: true }
    })
  });
  
  if (!res.ok) {
    console.warn("Vision model failed with image_url array format. Falling back to text-only OCR...");
    // Fallback if the model is not actually multimodal
    const fallbackRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NIM_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.2,
        top_p: 0.95,
        chat_template_kwargs: { enable_thinking: true }
      })
    });
    if (!fallbackRes.ok) throw new Error(`Vision fallback failed: ${fallbackRes.status} - ${await fallbackRes.text()}`);
    const data = await fallbackRes.json();
    return extractJson(data.choices[0].message.content);
  }
  
  const data = await res.json();
  return extractJson(data.choices[0].message.content);
}

// 3. Architecture Spec Stage
async function runArchitectureSpec(widgetTrees: any[]) {
  const prompt = `Given widget_tree specs for ${widgetTrees.length} screens: ${JSON.stringify(widgetTrees)}
1. Infer the navigation flow — which screens link to which
2. Generate go_router route definitions for all screens
3. Identify shared state that should be global providers vs screen-scoped
4. Produce final screen_spec JSON for each screen with route_name assigned
5. Produce the complete list of Cross-doc RAG providers needed (type, initialValue, notifier class if needed)
Output STRICTLY a JSON object matching: { "screens": [...screen_specs], "providers": [...], "routes": [...] }`;

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NIM_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16384,
      temperature: 0.2,
      top_p: 0.95,
      extra_body: { chat_template_kwargs: { enable_thinking: true }, reasoning_budget: 8192 }
    })
  });
  if (!res.ok) throw new Error(`Arch Spec failed: ${res.status} - ${await res.text()}`);
  const data = await res.json();
  return extractJson(data.choices[0].message.content);
}

// 4. Code Generation Stage
async function generateScreenCode(screenSpec: any) {
  const prompt = `Generate production Research insights for this screen spec: ${JSON.stringify(screenSpec)}

Rules (STRICT):
- Use ConsumerWidget (not StatelessWidget) if any providers are referenced
- All colors from AppColors constants class, no hardcoded hex
- All text styles from AppTextStyles constants class  
- Import only: flutter/material.dart, flutter_riverpod, go_router, and local providers/constants
- Widget build() must return the exact widget tree from the spec
- Async providers use AsyncValue.when(data:, loading:, error:)
- No placeholder comments — generate real working code
- File must be 100% valid Dart, compilable with flutter_riverpod 2.x

Output ONLY the raw Dart code, no markdown fences.`;

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NIM_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.6",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16384,
      temperature: 0.2,
      top_p: 0.95
    })
  });
  if (!res.ok) throw new Error(`Code Gen failed: ${res.status} - ${await res.text()}`);
  const data = await res.json();
  let code = data.choices[0].message.content;
  // Clean up markdown fences if model ignored instruction
  code = code.replace(/^```dart/m, '').replace(/^```/m, '').trim();
  return code;
}

// Helper: Extract JSON from mixed text
function extractJson(text: string) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
  const jsonText = match ? match[1] : text;
  // Find first { and last } if it still has junk
  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return JSON.parse(jsonText.substring(start, end + 1));
  }
  return JSON.parse(jsonText);
}

export const maxDuration = 300; // 5 minute timeout for Vercel

export async function POST(req: Request) {
  try {
    const { images } = await req.json(); // array of base64 strings

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Missing 'images' array" }, { status: 400 });
    }

    if (!NIM_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Pipeline Step 1 & 2 (Parallel per image)
    console.log("Starting Step 1 & 2...");
    const widgetTrees = await Promise.all(
      images.map(async (imageB64: string, index: number) => {
        console.log(`Processing image ${index + 1}/${images.length}`);
        const ocrData = await runOCR(imageB64);
        const widgetTree = await runVisionMapping(imageB64, ocrData);
        // Inject an identifier so arch stage knows which is which
        return { screenId: `Screen${index + 1}`, ...widgetTree };
      })
    );

    // Pipeline Step 3
    console.log("Starting Step 3...");
    const archSpec = await runArchitectureSpec(widgetTrees);

    // Pipeline Step 4
    console.log("Starting Step 4...");
    const screens = archSpec.screens || [];
    
    // Generate code for each screen
    const screenCodes = await Promise.all(
      screens.map(async (screen: any) => {
        const code = await generateScreenCode(screen);
        return {
          filename: `${screen.screen_name ? screen.screen_name.toLowerCase() : 'screen'}.dart`,
          code
        };
      })
    );

    // Create the ZIP archive
    console.log("Packaging ZIP...");
    const zip = new JSZip();
    const myApp = zip.folder("my_app");
    if (!myApp) throw new Error("Failed to create root folder in ZIP");

    // Standard Pubspec
    myApp.file("pubspec.yaml", `name: generated_app
description: A new Knowledge Graph.
publish_to: 'none'
version: 1.0.0+1
environment:
  sdk: '>=3.0.0 <4.0.0'
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  go_router: ^14.1.4
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
flutter:
  uses-material-design: true
`);
    
    // Basic analysis options
    myApp.file("analysis_options.yaml", `include: package:flutter_lints/flutter.yaml
linter:
  rules:
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
`);

    const lib = myApp.folder("lib");
    if (!lib) throw new Error("Failed to create lib folder");

    // Main.dart placeholder
    lib.file("main.dart", `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_router.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Generated App',
      theme: ThemeData(useMaterial3: true),
      routerConfig: appRouter,
    );
  }
}`);

    // Basic app_router.dart
    lib.file("app_router.dart", `import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
// TODO: Import screens

final appRouter = GoRouter(
  routes: [
    // TODO: Define routes from spec
  ],
);`);

    // Constants
    const constants = lib.folder("constants");
    if (constants) {
      constants.file("app_colors.dart", `import 'package:flutter/material.dart';
class AppColors {
  static const Color primary = Color(0xFF6200EE);
  static const Color background = Color(0xFFFFFFFF);
  // Extracted dynamically by LLM
}`);
      constants.file("app_text_styles.dart", `import 'package:flutter/material.dart';
class AppTextStyles {
  static const TextStyle heading = TextStyle(fontSize: 24, fontWeight: FontWeight.bold);
  static const TextStyle body = TextStyle(fontSize: 16);
}`);
    }

    // Screens
    const screensFolder = lib.folder("screens");
    if (screensFolder) {
      screenCodes.forEach((sc, idx) => {
        // Strip suffixes for folder name
        const folderName = sc.filename.replace('_screen.dart', '').replace('.dart', '');
        const screenDir = screensFolder.folder(folderName) || screensFolder;
        screenDir.file(sc.filename, sc.code);
      });
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBase64 = zipBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      message: "Generated successfully",
      archSpec, // return the JSON so the frontend can display it too
      zipBase64
    });
  } catch (err: any) {
    console.error("Flutter Gen Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
