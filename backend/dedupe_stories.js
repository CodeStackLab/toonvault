const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function removeDuplicateStories() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find().sort({ createdAt: -1 }); // newest first
    console.log(`Initial Story Count: ${stories.length}`);

    const seenTitles = new Map();
    const idsToDelete = [];

    for (const story of stories) {
        const titleKey = story.title?.trim().toLowerCase();
        if (!titleKey) continue;

        if (seenTitles.has(titleKey)) {
            // Already kept a newer version of this story
            idsToDelete.push(story._id);
        } else {
            // Keep this story as the master version
            seenTitles.set(titleKey, story);
        }
    }

    console.log(`Unique Stories Kept: ${seenTitles.size}`);
    console.log(`Duplicate Stories to Delete: ${idsToDelete.length}`);

    if (idsToDelete.length > 0) {
        const result = await Story.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`✅ Successfully deleted ${result.deletedCount} duplicate story entries from database.`);
    } else {
        console.log("No duplicate stories found to delete.");
    }

    const finalCount = await Story.countDocuments();
    console.log(`Final Clean Story Count: ${finalCount}`);

    await mongoose.disconnect();
}

removeDuplicateStories().catch(console.error);
