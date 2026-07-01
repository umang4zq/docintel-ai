import fs from 'fs';

const key = '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';
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
