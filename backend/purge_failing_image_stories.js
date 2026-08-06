const mongoose = require('mongoose');
const axios = require('axios');
const Story = require('./models/Story');
const redis = require('./redisClient');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function purgeFailingImageStories() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find();
    console.log(`Testing live image HTTP accessibility for ${stories.length} stories...`);

    const idsToDelete = [];
    let checkedCount = 0;

    for (const story of stories) {
        checkedCount++;
        const title = story.title || "Untitled";
        const coverUrl = (story.panels && story.panels.length > 0 && story.panels[0].startsWith('http')) 
            ? story.panels[0] 
            : (story.episodes && story.episodes[0] && story.episodes[0].panels && story.episodes[0].panels[0]?.startsWith('http') ? story.episodes[0].panels[0] : null);

        if (!coverUrl) {
            console.log(`[❌ NO IMAGE URL] ID: ${story._id} | Title: "${title}" -> Marked for deletion`);
            idsToDelete.push(story._id);
            continue;
        }

        // Test if image URL is live and returning HTTP 200 OK
        try {
            const resp = await axios.head(coverUrl, { timeout: 4000, validateStatus: status => status === 200 });
            // Image is valid
        } catch (err) {
            // Try GET with range request if HEAD failed
            try {
                await axios.get(coverUrl, { timeout: 4000, headers: { Range: 'bytes=0-100' }, validateStatus: status => status >= 200 && status < 400 });
            } catch (err2) {
                console.log(`[❌ IMAGE FAILED TO LOAD] ID: ${story._id} | Title: "${title}" | URL: ${coverUrl.slice(0, 70)} -> Marked for deletion`);
                idsToDelete.push(story._id);
            }
        }
    }

    console.log(`\nScan Complete (${checkedCount} stories tested).`);
    console.log(`Total stories with failing images: ${idsToDelete.length}`);

    if (idsToDelete.length > 0) {
        const res = await Story.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`✅ Deleted ${res.deletedCount} failing image stories from MongoDB.`);
        await redis.del('stories:all');
    } else {
        console.log("🎉 All story image URLs are 100% live and loading cleanly!");
    }

    const remainingCount = await Story.countDocuments();
    console.log(`Final Active Clean Stories in Database: ${remainingCount}`);

    await mongoose.disconnect();
}

purgeFailingImageStories().catch(console.error);
