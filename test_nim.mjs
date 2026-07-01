import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const key = env.split('\n').find(l => l.startsWith('VITE_NIM_API_KEY=')).split('=')[1];

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

async function testModel(model) {
  try {
    const res = await fetch(invokeUrl, {
      method: 'POST',
      body: JSON.stringify({
        model: model,
        messages: [{"role":"user","content":"Hi"}],
        max_tokens: 100,
      }),
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      console.error(`Error ${model}:`, await res.text());
    } else {
      console.log(`Success ${model}`);
    }
  } catch (err) {
    console.error(`Error ${model}:`, err);
  }
}

testModel('moonshotai/kimi-k2.6');
testModel('nvidia/nemotron-super-120b-instruct');
