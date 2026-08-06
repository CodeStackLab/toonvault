const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function updateDbCovers() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find();
    console.log(`Updating cover images for ${stories.length} stories...`);

    let updatedCount = 0;

    for (const story of stories) {
        const title = story.title || "Webtoon Story";
        const genre = story.genre || "Manhwa";

        // Generate deterministic seed based on story ID / Title
        let seed = 0;
        const str = (story._id.toString() + title);
        for (let i = 0; i < str.length; i++) {
            seed = (seed << 5) - seed + str.charCodeAt(i);
        }
        seed = Math.abs(seed % 1000000);

        const cleanPrompt = `masterpiece ultra detailed Korean manhwa anime webtoon poster cover art, ${title}, ${genre} theme, dynamic cinematic lighting, vivid colors, 8k resolution`;
        const generatedCoverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=768&nologo=true&seed=${seed}`;

        // Ensure panels array exists and panels[0] is set to a unique image URL
        if (!story.panels || story.panels.length === 0 || !story.panels[0] || !story.panels[0].startsWith('http')) {
            story.panels = [generatedCoverUrl];
            if (story.episodes && story.episodes.length > 0) {
                story.episodes[0].panels = [generatedCoverUrl];
            }
            await story.save();
            updatedCount++;
        }
    }

    console.log(`✅ Successfully updated ${updatedCount} stories with unique cover image URLs in MongoDB.`);
    await mongoose.disconnect();
}

updateDbCovers().catch(console.error);
