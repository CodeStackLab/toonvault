const axios = require('axios');
const mongoose = require('mongoose');
const Story = require('./models/Story');
const crypto = require('crypto');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toonvault';

async function seedQuotesToon() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const MISTRAL_KEY = process.env.MISTRAL_API_KEY;
    const RUNWARE_KEY = process.env.RUNWARE_API_KEY;

    console.log('🚀 Step 1: Generating Quotes with Mistral...');
    
    const mistralResp = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: "mistral-small-latest",
        messages: [{
            role: "system",
            content: "You are a world-class creator of aesthetic, philosophical, and deep quotes. Your output MUST be a JSON object with: title (a compelling collection name), description (an evocative summary), and an array 'panels' (length 5). Each panel item must have 'text' (a profound, beautifully phrased quote) and 'imagePrompt' (a cute, vibrant toon/anime style illustration description that perfectly mirrors the quote's mood)."
        }, {
            role: "user",
            content: "Curate 5 masterpiece quotes about 'Hope and Dreams' in a vibrant, colorful toon/anime style."
        }],
        response_format: { type: "json_object" }
    }, { headers: { 'Authorization': `Bearer ${MISTRAL_KEY}` } });

    const storyData = JSON.parse(mistralResp.data.choices[0].message.content);
    console.log('✅ Quotes Generated:', storyData.title);

    console.log('🎨 Step 2: Generating 5 Toon-Style Images with Runware Flux...');
    
    const runwareTasks = [
        { taskType: "authentication", apiKey: RUNWARE_KEY },
        ...storyData.panels.map((p, idx) => ({
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            model: "runware:100@1",
            positivePrompt: `masterpiece, cute vibrant toon style, colorful anime aesthetic, high quality illustration, clean lines, ${p.imagePrompt}`,
            width: 512,
            height: 768,
            numberResults: 1,
            outputFormat: "JPG",
            CFGScale: 3.5,
            steps: 4
        }))
    ];

    const runwareResp = await axios.post('https://api.runware.ai/v1', runwareTasks);
    const imageUrls = runwareResp.data.data
        .filter(d => d.taskType === "imageInference")
        .map(d => d.imageURL);

    console.log('✅ Images Generated:', imageUrls.length);

    const episode1 = {
        number: 1,
        title: "Hope & Dreams",
        panels: imageUrls,
        content: JSON.stringify(storyData.panels.map((p, i) => ({ text: p.text }))),
        createdAt: new Date()
    };

    const newStory = new Story({
        title: storyData.title,
        genre: "Quotes",
        coverIcon: "✨",
        coverBg: "#1A1A2E",
        authorId: "admin",
        authorName: "ToonVault AI",
        views: 450000,
        rating: 9.9,
        likes: 120000,
        status: "Live",
        type: "Novel",
        description: storyData.description,
        panels: imageUrls,
        episodes: [episode1]
    });

    await newStory.save();
    console.log('✨ SUCCESS! Quotes Toon Story Seeded with ID:', newStory._id);
    console.log(`🔗 LIVE LINK: https://toonvault.com/story/${newStory._id}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    process.exit(1);
  }
}

seedQuotesToon();
