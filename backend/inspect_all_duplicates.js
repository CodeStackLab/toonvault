const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function checkAllDuplicates() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find();
    console.log(`Analyzing ${stories.length} total stories in Database...\n`);

    // 1. Duplicate Story Titles
    const titleMap = {};
    stories.forEach(s => {
        const title = s.title?.trim();
        if (!titleMap[title]) titleMap[title] = [];
        titleMap[title].push(s._id);
    });

    let duplicateTitleCount = 0;
    Object.keys(titleMap).forEach(t => {
        if (titleMap[t].length > 1) {
            duplicateTitleCount++;
            console.log(`[Duplicate Title] "${t}" appears ${titleMap[t].length} times: IDs [${titleMap[t].join(', ')}]`);
        }
    });
    console.log(`\nTotal Duplicate Story Titles: ${duplicateTitleCount}`);

    // 2. Duplicate Panel Images Across Stories
    const imgMap = {};
    stories.forEach(s => {
        const imgsInStory = new Set();
        if (s.panels) s.panels.forEach(url => { if (url) imgsInStory.add(url); });
        if (s.episodes) {
            s.episodes.forEach(ep => {
                if (ep.panels) ep.panels.forEach(url => { if (url) imgsInStory.add(url); });
                if (ep.content) {
                    try {
                        const parsed = JSON.parse(ep.content);
                        if (Array.isArray(parsed)) {
                            parsed.forEach(p => { if (p.imageUrl) imgsInStory.add(p.imageUrl); });
                        }
                    } catch (e) {}
                }
            });
        }
        imgsInStory.forEach(url => {
            if (!imgMap[url]) imgMap[url] = [];
            imgMap[url].push({ id: s._id, title: s.title });
        });
    });

    let sharedImageCount = 0;
    Object.keys(imgMap).forEach(url => {
        if (imgMap[url].length > 1) {
            sharedImageCount++;
            console.log(`[Shared Image URL] "${url.slice(0, 60)}..." shared across ${imgMap[url].length} stories`);
        }
    });
    console.log(`\nTotal Shared/Duplicate Image URLs across stories: ${sharedImageCount}`);

    await mongoose.disconnect();
}

checkAllDuplicates().catch(console.error);
