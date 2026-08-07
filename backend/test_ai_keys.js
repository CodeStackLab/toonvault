const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const MISTRAL_KEY = process.env.MISTRAL_API_KEY || 'YyfYhkuBhuF2gQML0jlGnS6X0XrLloP7';
const RUNWARE_KEY = process.env.RUNWARE_API_KEY || 'pJWrGTD9NYgjxi30BnHrdupOQ4y3Ro3t';

async function testKeys() {
  console.log('Testing Mistral AI API key...');
  try {
    const mistralResp = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model: "mistral-small-latest",
      messages: [{ role: "user", content: "Say 'Mistral AI Connected!'" }]
    }, { headers: { 'Authorization': `Bearer ${MISTRAL_KEY}` } });
    console.log('✅ Mistral AI response:', mistralResp.data.choices[0].message.content.trim());
  } catch (err) {
    console.error('❌ Mistral Error:', err.response?.data || err.message);
  }

  console.log('\nTesting Runware AI API key...');
  try {
    const runwareTasks = [
      { taskType: "authentication", apiKey: RUNWARE_KEY },
      {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        model: "runware:100@1",
        positivePrompt: "masterpiece, webtoon anime style, glowing vault door, fantasy digital art",
        width: 512,
        height: 768,
        numberResults: 1,
        outputFormat: "JPG",
        CFGScale: 3.5,
        steps: 4
      }
    ];
    const runwareResp = await axios.post('https://api.runware.ai/v1', runwareTasks);
    console.log('✅ Runware AI raw data:', JSON.stringify(runwareResp.data).substring(0, 300));
  } catch (err) {
    console.error('❌ Runware Error:', err.response?.data || err.message);
  }
}

testKeys();
