const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function fixExpiredUrls() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find();
    console.log(`Checking ${stories.length} stories for expired Runware URLs...`);

    let fixedStories = 0;

    for (const story of stories) {
        let modified = false;
        const title = story.title || "Webtoon Story";
        const genre = story.genre || "Manhwa";

        let seed = 0;
        const str = (story._id.toString() + title);
        for (let i = 0; i < str.length; i++) {
            seed = (seed << 5) - seed + str.charCodeAt(i);
        }
        seed = Math.abs(seed % 1000000);

        const cleanPrompt = `masterpiece ultra detailed Korean manhwa anime webtoon poster cover art, ${title}, ${genre} theme, dynamic cinematic lighting, 8k`;
        const freshCoverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=768&nologo=true&seed=${seed}`;

        // Fix root panels if it contains runware.ai or invalid url
        if (!story.panels || story.panels.length === 0 || story.panels.some(p => !p || p.includes('runware.ai'))) {
            story.panels = [freshCoverUrl];
            modified = true;
        }

        // Fix episode panels
        if (story.episodes && story.episodes.length > 0) {
            story.episodes.forEach((ep, epIdx) => {
                if (!ep.panels || ep.panels.length === 0 || ep.panels.some(p => !p || p.includes('runware.ai'))) {
                    const epPrompt = `masterpiece Korean manhwa webtoon episode panel art, ${title} Episode ${ep.number || epIdx+1}, ${genre}, cinematic lighting`;
                    const epSeed = seed + (ep.number || epIdx + 1) * 100;
                    const epUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(epPrompt)}?width=512&height=768&nologo=true&seed=${epSeed}`;
                    ep.panels = [epUrl];
                    
                    // Also update content JSON if present
                    if (ep.content) {
                        try {
                            const arr = JSON.parse(ep.content);
                            if (Array.isArray(arr)) {
                                arr.forEach((item, pIdx) => {
                                    item.imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(epPrompt + " panel " + (pIdx+1))}?width=512&height=768&nologo=true&seed=${epSeed + pIdx}`;
                                });
                                ep.content = JSON.stringify(arr);
                            }
                        } catch(e) {}
                    }
                    modified = true;
                }
            });
        }

        if (modified) {
            await story.save();
            fixedStories++;
        }
    }

    console.log(`✅ Fixed and updated ${fixedStories} stories in MongoDB with fresh working image URLs!`);
    await mongoose.disconnect();
}

fixExpiredUrls().catch(console.error);
