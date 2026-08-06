const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function cleanBrokenStories() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find();
    console.log(`Checking ${stories.length} stories for broken/missing image content...`);

    const idsToDelete = [];

    for (const story of stories) {
        // Check if panels exist and have valid HTTP URLs
        const hasValidRootPanel = Array.isArray(story.panels) && story.panels.length > 0 && story.panels[0] && typeof story.panels[0] === 'string' && story.panels[0].startsWith('http');
        
        let hasValidEpPanel = false;
        if (Array.isArray(story.episodes) && story.episodes.length > 0) {
            const firstEp = story.episodes[0];
            if (Array.isArray(firstEp.panels) && firstEp.panels.length > 0 && firstEp.panels[0] && typeof firstEp.panels[0] === 'string' && firstEp.panels[0].startsWith('http')) {
                hasValidEpPanel = true;
            }
        }

        // If story has no valid image panel anywhere, mark it for deletion
        if (!hasValidRootPanel && !hasValidEpPanel) {
            console.log(`[Broken Story Marked For Deletion] ID: ${story._id} | Title: "${story.title}"`);
            idsToDelete.push(story._id);
        }
    }

    console.log(`\nTotal Broken Stories Found: ${idsToDelete.length}`);

    if (idsToDelete.length > 0) {
        const res = await Story.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`✅ Deleted ${res.deletedCount} broken stories from database.`);
    } else {
        console.log("No broken stories found. All stories have valid image URLs!");
    }

    const remaining = await Story.countDocuments();
    console.log(`Remaining Clean Stories in DB: ${remaining}`);

    await mongoose.disconnect();
}

cleanBrokenStories().catch(console.error);
