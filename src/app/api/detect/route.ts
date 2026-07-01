import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image is required (base64 data URL)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Step 1: Call Nemotron OCR
    console.log("Calling Nemotron-OCR API...");
    const ocrResponse = await fetch("https://ai.api.nvidia.com/v1/cv/nvidia/nemotron-ocr-v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        input: [
          {
            type: "image_url",
            url: image, // expected: "data:image/png;base64,..."
          },
        ],
      }),
    });

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error("OCR API error:", ocrResponse.status, errorText);
      return NextResponse.json(
        { error: `OCR Service Error: ${ocrResponse.statusText}`, details: errorText },
        { status: ocrResponse.status }
      );
    }

    const ocrData = await ocrResponse.json();
    const detections = ocrData.data?.[0]?.text_detections || [];
    console.log(`OCR Detections received: ${detections.length} elements`);

    if (detections.length === 0) {
      return NextResponse.json({
        layoutDescription: "No text elements detected in the provided image.",
        elements: [],
        hierarchy: [],
        accessibilitySuggestions: ["Ensure the image is clear and has readable text."],
      });
    }

    // Step 2: Formulate prompt for Nemotron-3 Super 120B to analyze layout & elements
    const cleanDetections = detections.map((det: any, idx: number) => {
      const pts = det.bounding_box?.points || [];
      // Calculate normalized bounding box properties (x, y, w, h)
      // points are typically [topLeft, topRight, bottomRight, bottomLeft]
      const xs = pts.map((p: any) => p.x);
      const ys = pts.map((p: any) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      return {
        id: idx,
        text: det.text_prediction?.text || "",
        confidence: det.text_prediction?.confidence || 0,
        box: {
          x: minX,
          y: minY,
          w: maxX - minX,
          h: maxY - minY,
        },
      };
    });

    console.log("Calling Nemotron-3-Super-120B-A12B API...");
    const systemPrompt = `You are a UI layout parser and element detector assistant. Analyze the given OCR detections (text + normalized bounding box coordinates) from a screenshot of a user interface. Group them into semantic UI elements (buttons, inputs, cards, sections, links, headers, nav etc.), describe the layout hierarchy, and output your findings in structured JSON.`;

    const userPrompt = `Analyze the following UI layout text detections. 
Format your output strictly as a JSON object (inside or outside markdown block) matching this exact format:
{
  "layoutDescription": "High level description of the page structure (e.g. Dashboard with sidebar and 3 grid columns).",
  "elements": [
    {
      "id": 0,
      "text": "Element text",
      "type": "button | input | header | link | card | navigation-item | label | status-badge | other",
      "boundingBox": {
        "x": 0.05, 
        "y": 0.12,
        "width": 0.1,
        "height": 0.04
      },
      "description": "Role of this element in the UI.",
      "ocrIndex": 0
    }
  ],
  "hierarchy": [
    {
      "groupName": "Sidebar / Header / Main Grid / etc.",
      "elementIds": [0, 1, 2],
      "description": "Short description of this group's purpose."
    }
  ],
  "accessibilitySuggestions": [
    "Accessibility improvement suggestion 1",
    "Accessibility improvement suggestion 2"
  ]
}

OCR Detections:
${JSON.stringify(cleanDetections, null, 2)}`;

    const chatResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error("Nemotron-3 API error:", chatResponse.status, errorText);
      // Fallback: Return raw OCR coordinates if LLM fails
      return NextResponse.json({
        layoutDescription: "Layout analysis fallback (LLM offline). Directly showing OCR text elements.",
        elements: cleanDetections.map((det) => ({
          id: det.id,
          text: det.text,
          type: "label",
          boundingBox: {
            x: det.box.x,
            y: det.box.y,
            width: det.box.w,
            height: det.box.h,
          },
          description: "Detected raw text element.",
          ocrIndex: det.id,
        })),
        hierarchy: [],
        accessibilitySuggestions: ["Unable to generate accessibility suggestions at this time."],
      });
    }

    const chatData = await chatResponse.json();
    const assistantReply = chatData.choices?.[0]?.message?.content || "";
    console.log("Nemotron-3 reply received.");

    // Extract JSON block
    const jsonMatch =
      assistantReply.match(/```json\s*([\s\S]*?)\s*```/) ||
      assistantReply.match(/```\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : assistantReply;

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText.trim());
    } catch (e) {
      console.error("Failed to parse LLM response as JSON. Raw reply:", assistantReply);
      // Fallback representation
      parsedResult = {
        layoutDescription: "Could not parse structured layout description. Showing raw analysis text.",
        elements: cleanDetections.map((det) => ({
          id: det.id,
          text: det.text,
          type: "other",
          boundingBox: {
            x: det.box.x,
            y: det.box.y,
            width: det.box.w,
            height: det.box.h,
          },
          description: "Detected text element.",
          ocrIndex: det.id,
        })),
        hierarchy: [],
        accessibilitySuggestions: ["Please check the console or raw logs for full analysis."],
        rawText: assistantReply,
      };
    }

    return NextResponse.json({
      ...parsedResult,
      rawOcr: cleanDetections,
    });
  } catch (error: any) {
    console.error("Server API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
