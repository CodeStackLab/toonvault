const mongoose = require('mongoose');
const Story = require('./models/Story');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/toonvault';

const seedStory = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const storyId = '69f7365c1cd954ae93abb532';
        const existing = await Story.findById(storyId);
        
        if (existing) {
            console.log('Story already exists, updating...');
            existing.title = 'The Lemon Forest';
            existing.description = 'A mystical journey through a forest where lemons glow with ancient magic and secrets are hidden in the peel.';
            existing.genre = 'Fantasy';
            existing.coverIcon = '🍋';
            existing.panels = ['/src/assets/lemon_forest.png'];
            await existing.save();
        } else {
            console.log('Creating new story...');
            const newStory = new Story({
                _id: storyId,
                title: 'The Lemon Forest',
                description: 'A mystical journey through a forest where lemons glow with ancient magic and secrets are hidden in the peel.',
                genre: 'Fantasy',
                authorName: 'ToonVault AI',
                status: 'Live',
                type: 'Comic',
                coverIcon: '🍋',
                panels: ['/src/assets/lemon_forest.png'],
                views: 1250,
                likes: 450
            });
            await newStory.save();
        }

        console.log('Story seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedStory();
