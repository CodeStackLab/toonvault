const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function checkDuplicates() {
    await mongoose.connect(MONGO_URI);
    const stories = await Story.find();
    console.log(`Analyzing ${stories.length} stories for duplicate images...\n`);

    let affectedStories = 0;

    for (const story of stories) {
        let storyHasDups = false;

        // Check root panels
        if (story.panels && story.panels.length > 0) {
            const uniquePanels = [...new Set(story.panels)];
            if (uniquePanels.length < story.panels.length) {
                console.log(`[Story: "${story.title}"] Root panels has duplicates: ${story.panels.length} -> ${uniquePanels.length}`);
                storyHasDups = true;
            }
        }

        // Check episode panels
        if (story.episodes && story.episodes.length > 0) {
            story.episodes.forEach((ep, idx) => {
                if (ep.panels && ep.panels.length > 0) {
                    const uniqueEpPanels = [...new Set(ep.panels)];
                    if (uniqueEpPanels.length < ep.panels.length) {
                        console.log(`[Story: "${story.title}" | Ep ${ep.number || idx+1}] Episode panels has duplicates: ${ep.panels.length} -> ${uniqueEpPanels.length}`);
                        storyHasDups = true;
                    }
                }

                if (ep.content) {
                    try {
                        const parsed = JSON.parse(ep.content);
                        if (Array.isArray(parsed)) {
                            const imgUrls = parsed.map(p => p.imageUrl).filter(Boolean);
                            const uniqueImgs = [...new Set(imgUrls)];
                            if (uniqueImgs.length < imgUrls.length) {
                                console.log(`[Story: "${story.title}" | Ep ${ep.number || idx+1}] Episode JSON content has duplicates: ${imgUrls.length} -> ${uniqueImgs.length}`);
                                storyHasDups = true;
                            }
                        }
                    } catch (e) {}
                }
            });
        }

        if (storyHasDups) affectedStories++;
    }

    console.log(`\nTotal stories with duplicate images: ${affectedStories} / ${stories.length}`);
    await mongoose.disconnect();
}

checkDuplicates().catch(console.error);
