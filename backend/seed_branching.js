const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

async function seedBranchingStory() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for branching story seed");

        const branchingStory = {
            title: "Hearts of Ash",
            genre: "Fantasy",
            authorName: "Starryink",
            description: "A world of flames and secrets.",
            status: 'Live',
            type: 'Comic',
            nodes: [
                { id: 's1', type: 'scene', label: 'Scene 1', title: 'The Awakening', status: 'read', x: 0, y: 0 },
                { id: 's2', type: 'scene', label: 'Scene 2', title: 'Golden Secrets', status: 'read', x: 120, y: 0 },
                { id: 's3', type: 'scene', label: 'Scene 3', title: 'Hidden Paths', status: 'read', x: 240, y: 0 },
                { id: 's4', type: 'scene', label: 'Scene 4', title: 'After the Fire', status: 'read', x: 360, y: 0 },
                { id: 'c1', type: 'choice', label: 'A', title: 'Protect the Secret', status: 'unlocked', isPopular: true, x: 500, y: -90, parentId: 's4' },
                { id: 'c2', type: 'choice', label: 'B', title: 'Follow Your Heart', status: 'locked', x: 500, y: -30, parentId: 's4' },
                { id: 'c3', type: 'choice', label: 'C', title: 'Chase the Truth', status: 'locked', x: 500, y: 30, parentId: 's4' },
                { id: 'c4', type: 'choice', label: 'D', title: 'Write Your Own Story', status: 'locked', x: 500, y: 90, parentId: 's4' },
            ]
        };

        const newStory = new Story(branchingStory);
        await newStory.save();
        console.log("✅ Branching Story Seeded: " + newStory._id);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedBranchingStory();
