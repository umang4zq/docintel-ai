import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const key = env.split('\n').find(l => l.startsWith('VITE_NIM_API_KEY=')).split('=')[1];

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const embedUrl = "https://integrate.api.nvidia.com/v1/embeddings";

async function testChatModel(model) {
  try {
    const res = await fetch(invokeUrl, {
      method: 'POST',
      body: JSON.stringify({
        model: model,
        messages: [{"role":"user","content":"Hi"}],
        max_tokens: 50,
      }),
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      console.log(`❌ ${model} -> Error ${res.status}: ${await res.text()}`);
    } else {
      console.log(`✅ ${model} -> Success!`);
    }
  } catch (err) {
    console.log(`❌ ${model} -> Request failed: ${err.message}`);
  }
}

async function testEmbedModel(model) {
  try {
    const res = await fetch(embedUrl, {
      method: 'POST',
      body: JSON.stringify({
        model: model,
        input: ["test"],
        input_type: 'query'
      }),
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      console.log(`❌ ${model} (Embedding) -> Error ${res.status}: ${await res.text()}`);
    } else {
      console.log(`✅ ${model} (Embedding) -> Success!`);
    }
  } catch (err) {
    console.log(`❌ ${model} (Embedding) -> Request failed: ${err.message}`);
  }
}

async function run() {
  console.log("Testing models used in docIntelAI.ts...");
  await testChatModel('moonshotai/kimi-k2.6');
  await testChatModel('nvidia/nemotron-super-120b-instruct');
  await testChatModel('google/gemma-4-31b-it');
  await testEmbedModel('nvidia/nv-embedqa-e5-v5');
}

run();
