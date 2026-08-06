const mongoose = require('mongoose');
const axios = require('axios');
const crypto = require('crypto');
const Story = require('./models/Story');
const redis = require('./redisClient');

const MISTRAL_KEY = "VztpyOHj6iS6uF8FKNRvLLxFeG3oS3RR";
const RUNWARE_KEY = "3pPwlJnuUrB2N6pqS0vwJ1yqiGlMvEQA";
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

const REMAINING_STORIES = [
    {
        title: "My Roommate is a 1,000-Year-Old Demon",
        genre: "Comedy",
        description: "A broke college student accidentally signs a lease agreement with a lazy Demon Lord who is obsessed with instant ramen and video games.",
        episodePrompts: [
            "Episode 1: The Rent Agreement from Hell. Moving into a cheap apartment and discovering the roommate has horns.",
            "Episode 2: Demon Lord vs Instant Ramen. The ancient ruler discovers cheap human cuisine.",
            "Episode 3: The Convenience Store Duel. Defending the neighborhood convenience store from rival goblins."
        ]
    },
    {
        title: "Whispers of the Midnight Vault",
        genre: "Mystery",
        description: "A brilliant detective investigates an abandoned clocktower archive where old manuscripts write future murder cases by themselves.",
        episodePrompts: [
            "Episode 1: The Cipher in Room 404. Finding the glowing journal with tomorrow's newspaper headlines.",
            "Episode 2: Echoes of the Lost Heir. Deciphering the secret code written in invisible dragon ink.",
            "Episode 3: The Midnight Confession. Confronting the culprit at the top of the rain-slicked clocktower."
        ]
    },
    {
        title: "Neon Pulse: Cyber Vanguard",
        genre: "Sci-Fi",
        description: "In Neo-Seoul 2099, a cybernetically enhanced courier uncovers a mega-corp conspiracy that controls human memory chips.",
        episodePrompts: [
            "Episode 1: Circuit of the Fallen City. High-speed hoverbike chase through neon rain alleys.",
            "Episode 2: The Quantum Core Hijack. Infiltrating the corporate tower data vault.",
            "Episode 3: Vanguard's Last Stand. Overclocking the cybernetic arm to defeat the mecha enforcer.",
            "Episode 4: Dawn of the Cyber Liberation. Broadcast the truth across every neural billboard."
        ]
    }
];

function getFastWebtoonImageUrl(prompt, seed) {
    const clean = `masterpiece ultra-detailed Korean manhwa webtoon anime art, ${prompt}`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=512&height=768&nologo=true&seed=${seed}`;
}

async function generateScriptMistral(systemPrompt, userPrompt) {
    try {
        const resp = await axios.post("https://api.mistral.ai/v1/chat/completions", {
            model: "mistral-small-latest",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: { 'Authorization': `Bearer ${MISTRAL_KEY}` },
            timeout: 30000
        });

        return JSON.parse(resp.data.choices[0].message.content);
    } catch (e) {
        console.error("Mistral Script Error:", e.message);
        return {
            episodeTitle: "Webtoon Chapter",
            panels: [
                { speaker: "Narrator", text: "The story unfolds in unexpected ways...", imagePrompt: "manhwa scene" },
                { speaker: "Protagonist", text: "I never expected this secret to be revealed today!", imagePrompt: "anime reaction" },
                { speaker: "Rival", text: "This is only the beginning of our fate.", imagePrompt: "dramatic confrontation" }
            ],
            choices: [{ text: "Fight back" }, { text: "Retreat for now" }]
        };
    }
}

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log("🚀 Completing Remaining Multi-Episode Stories...\n");

    for (let sIdx = 0; sIdx < REMAINING_STORIES.length; sIdx++) {
        const item = REMAINING_STORIES[sIdx];
        console.log(`===========================================================`);
        console.log(`📖 Generating Story ${sIdx + 3}/5: "${item.title}" (${item.genre})`);
        console.log(`===========================================================`);

        const characterSeed = Math.floor(Math.random() * 1000000);
        const episodesList = [];
        let coverImageUrl = "";

        for (let epIdx = 0; epIdx < item.episodePrompts.length; epIdx++) {
            const epPromptStr = item.episodePrompts[epIdx];
            console.log(`  └─ Generating Episode ${epIdx + 1}/${item.episodePrompts.length}: "${epPromptStr.slice(0, 45)}..."`);

            const sysPrompt = `You are a world-class Manhwa scriptwriter. Write a 3-panel Webtoon episode JSON with:
            - episodeTitle: String
            - panels: Array of 3 objects { speaker: "Narration" or character name, text: "punchy short dialogue", imagePrompt: "detailed visual description for FLUX image generator" }
            - choices: Array of 2 voting options [{ text: "Choice A" }, { text: "Choice B" }]
            `;
            const userPrompt = `Story Title: "${item.title}". Genre: ${item.genre}. Plot: ${item.description}.\nEpisode Goal: ${epPromptStr}`;

            const aiScript = await generateScriptMistral(sysPrompt, userPrompt);
            const { episodeTitle, panels: scriptPanels, choices } = aiScript;

            const imageUrls = [];
            for (let pIdx = 0; pIdx < (scriptPanels || []).length; pIdx++) {
                const panel = scriptPanels[pIdx];
                const seed = characterSeed + (epIdx * 10) + pIdx;
                const imgUrl = getFastWebtoonImageUrl(panel.imagePrompt || item.title, seed);
                imageUrls.push(imgUrl);
            }

            if (epIdx === 0) {
                coverImageUrl = imageUrls[0] || "";
            }

            const enrichedContent = (scriptPanels || []).map((p, idx) => ({
                speaker: p.speaker || "Narration",
                text: p.text || "",
                imageUrl: imageUrls[idx] || ""
            }));

            episodesList.push({
                number: epIdx + 1,
                title: episodeTitle || `Episode ${epIdx + 1}`,
                panels: imageUrls,
                content: JSON.stringify(enrichedContent),
                choices: (choices || [{ text: "Choice A" }, { text: "Choice B" }]).map(c => ({ text: c.text, votes: Math.floor(Math.random() * 80) + 10 })),
                createdAt: new Date()
            });
        }

        const newStory = new Story({
            title: item.title,
            genre: item.genre,
            authorId: "admin",
            authorName: "ToonVault Studio",
            status: "Live",
            type: "Comic",
            description: item.description,
            isAgeRestricted: false,
            panels: [coverImageUrl],
            coverIcon: "✨",
            characterSeed: characterSeed,
            views: Math.floor(Math.random() * 40000) + 10000,
            likes: Math.floor(Math.random() * 3000) + 500,
            rating: 4.8 + (Math.random() * 0.2),
            episodes: episodesList,
            targetEpisodes: item.episodePrompts.length,
            isCompleted: true
        });

        await newStory.save();
        console.log(`✅ STORY SAVED IN MONGODB: "${newStory.title}" (_id: ${newStory._id}, Episodes: ${episodesList.length})\n`);
    }

    await redis.del('stories:all');
    console.log("🎉 ALL 5 MULTI-EPISODE STORIES GENERATED AND PUBLISHED LIVE!");
    await mongoose.disconnect();
}

main().catch(console.error);
