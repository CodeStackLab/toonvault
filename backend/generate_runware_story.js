const axios = require('axios');
const mongoose = require('mongoose');
const Story = require('./models/Story');
const crypto = require('crypto');
require('dotenv').config();

const MONGO_URI = 'mongodb://mongo:27017/toonvault';

async function generateEpisodes() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    const RUNWARE_KEY = process.env.RUNWARE_API_KEY;
    if (!RUNWARE_KEY) throw new Error("No Runware API Key in .env");

    const storyTitle = "Secret Seduction: The CEO's Contract";
    const storyDesc = "She signed a contract for a job, but ended up signing away her heart to the most dangerous, intoxicating CEO in the city. High quality, beautiful art.";
    
    // We'll generate 5 episodes, each with 8 images.
    const episodes = [];
    
    for (let ep = 1; ep <= 5; ep++) {
        console.log(`Generating images for Episode ${ep}...`);
        
        // Let's create an array of 8 prompts for this episode
        const prompts = [];
        for (let i = 0; i < 8; i++) {
            prompts.push(`masterpiece, highly detailed Manhwa style, beautiful anime aesthetic, cinematic lighting, intricate textures, 8k resolution, sexy young woman, handsome man, intense romance, office setting, Episode ${ep} Scene ${i}`);
        }

        const runwareTasks = [
            { taskType: "authentication", apiKey: RUNWARE_KEY },
            ...prompts.map((p, idx) => ({
                taskType: "imageInference",
                taskUUID: crypto.randomUUID(),
                model: "runware:100@1", // Using the Flux-based model configured
                positivePrompt: p,
                width: 512,
                height: 768,
                numberResults: 1,
                outputFormat: "JPG",
                CFGScale: 3.5,
                steps: 4
            }))
        ];

        const runwareResp = await axios.post('https://api.runware.ai/v1', runwareTasks, {
            headers: { 'Content-Type': 'application/json' }
        });

        const imageUrls = runwareResp.data.data
            .filter(d => d.taskType === "imageInference")
            .map(d => d.imageURL);
            
        // Mocking some simple content JSON
        const contentArr = imageUrls.map((url, i) => ({
            text: ep === 1 && i === 0 ? "It all started with a mistake..." : "..."
        }));

        episodes.push({
            number: ep,
            title: `Episode ${ep}`,
            panels: imageUrls,
            content: JSON.stringify(contentArr),
            createdAt: new Date(Date.now() - (6 - ep) * 86400000)
        });
        
        console.log(`✅ Episode ${ep} generated with ${imageUrls.length} images.`);
    }

    const newStory = new Story({
        title: storyTitle,
        genre: "Romance",
        coverIcon: "💋",
        coverBg: "#2B112B",
        authorId: "admin",
        authorName: "ToonVault AI",
        views: 5600000,
        rating: 9.9,
        likes: 890000,
        status: "Live",
        type: "Comic",
        description: storyDesc,
        panels: episodes[0].panels, 
        episodes: episodes
    });

    await newStory.save();
    console.log('✅ AI Story generated successfully with ID:', newStory._id);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during AI generation:', err.response?.data || err.message);
    process.exit(1);
  }
}

generateEpisodes();
