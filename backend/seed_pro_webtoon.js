const axios = require('axios');
const mongoose = require('mongoose');
const Story = require('./models/Story');
const crypto = require('crypto');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toonvault';

async function seedProWebtoon() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const MISTRAL_KEY = process.env.MISTRAL_API_KEY;
    const RUNWARE_KEY = process.env.RUNWARE_API_KEY;

    if (!MISTRAL_KEY || !RUNWARE_KEY) {
        throw new Error("Missing API Keys in .env");
    }

    console.log('🚀 Step 1: Generating Professional Story Script with Mistral...');
    
    const mistralResp = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: "mistral-small-latest",
        messages: [{
            role: "system",
            content: "You are an elite Manhwa (webtoon) writer. Output ONLY a JSON object with: title, description, and an array 'panels' (length 6) where each item has 'text' (narration/dialogue) and 'imagePrompt' (ultra-detailed Manhwa illustration instructions for Flux AI)."
        }, {
            role: "user",
            content: "Create a pilot episode for a sexy, mature romance webtoon titled 'Accidental Assassin's Love'. The story is about a female assassin who falls for her target, a cold-hearted billionaire."
        }],
        response_format: { type: "json_object" }
    }, { headers: { 'Authorization': `Bearer ${MISTRAL_KEY}` } });

    const storyData = JSON.parse(mistralResp.data.choices[0].message.content);
    console.log('✅ Story Script Generated:', storyData.title);

    console.log('🎨 Step 2: Generating 6 High-Quality Panels with Runware Flux...');
    
    const runwareTasks = [
        { taskType: "authentication", apiKey: RUNWARE_KEY },
        ...storyData.panels.map((p, idx) => ({
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            model: process.env.RUNWARE_MODEL || "runware:100@1",
            positivePrompt: `masterpiece, highly detailed Manhwa style, beautiful anime aesthetic, cinematic lighting, intricate textures, 8k resolution, ${p.imagePrompt}`,
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
        title: "Episode 1: The Contract",
        panels: imageUrls,
        content: JSON.stringify(storyData.panels.map((p, i) => ({ text: p.text }))),
        createdAt: new Date()
    };

    const newStory = new Story({
        title: storyData.title,
        genre: "Romance",
        coverIcon: "🔪",
        coverBg: "#1A0A0A",
        authorId: "admin",
        authorName: "ToonVault AI",
        views: 1200000,
        rating: 9.8,
        likes: 450000,
        status: "Live",
        type: "Comic",
        description: storyData.description,
        panels: imageUrls,
        episodes: [episode1]
    });

    await newStory.save();
    console.log('✨ SUCCESS! Professional Story Seeded with ID:', newStory._id);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    process.exit(1);
  }
}

seedProWebtoon();
