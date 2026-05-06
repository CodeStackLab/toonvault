const mongoose = require('mongoose');
const Story = require('./models/Story');

const MONGO_URI = 'mongodb://mongo:27017/toonvault';

async function seedStory() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    // Create the story Series
    const panelsE1 = [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000"
    ];

    const panelsE2 = [
        "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000",
        "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1000"
    ];

    const panelsE3 = [
        "https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?q=80&w=1000",
        "https://images.unsplash.com/photo-1554188248-986ada9dba1c?q=80&w=1000"
    ];

    const panelsE4 = [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
        "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000"
    ];

    const panelsE5 = [
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
        "https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?q=80&w=1000"
    ];

    const panelsE6 = [
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000",
        "https://images.unsplash.com/photo-1554188248-986ada9dba1c?q=80&w=1000"
    ];

    const newStory = new Story({
        title: "Accidental Assassin",
        genre: "Romance",
        coverIcon: "🗡️",
        coverBg: "#1f1418",
        authorId: "admin",
        authorName: "ToonVault AI",
        views: 2450000,
        rating: 9.8,
        likes: 124000,
        status: "Live",
        type: "Comic",
        description: "She thought she was applying for a job as an administrative assistant. Instead, she ended up in the underground world of elite assassins! Now, she has to navigate a deadly organization while avoiding the suspicious gazes of her brooding, dangerously handsome boss.",
        panels: panelsE1, // Ep 1 panels as default
        episodes: [
            { number: 1, title: "Episode 1: The Wrong Interview", panels: panelsE1, createdAt: new Date(Date.now() - 5 * 86400000) },
            { number: 2, title: "Episode 2: Contract Signed", panels: panelsE2, createdAt: new Date(Date.now() - 4 * 86400000) },
            { number: 3, title: "Episode 3: First Mission", panels: panelsE3, createdAt: new Date(Date.now() - 3 * 86400000) },
            { number: 4, title: "Episode 4: Close Call", panels: panelsE4, createdAt: new Date(Date.now() - 2 * 86400000) },
            { number: 5, title: "Episode 5: The Boss Steps In", panels: panelsE5, createdAt: new Date(Date.now() - 1 * 86400000) },
            { number: 6, title: "Episode 6: Secrets Revealed", panels: panelsE6, createdAt: new Date() }
        ]
    });

    await newStory.save();
    console.log('✅ Story "Accidental Assassin" seeded successfully with ID:', newStory._id);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedStory();
