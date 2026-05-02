const mongoose = require('mongoose');
const User = require('./models/User');
const Story = require('./models/Story');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/toonvault';

async function seedDemoUser() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        let user = await User.findOne({ username: 'demo_user' });
        const hashedPassword = await bcrypt.hash('demo123', 10);
        if (!user) {
            user = new User({
                username: 'demo_user',
                email: 'demo@toonvault.com',
                password: hashedPassword,
                plan: 'Gold',
                status: 'active'
            });
            await user.save();
            console.log('Created demo_user');
        } else {
            user.password = hashedPassword;
            await user.save();
            console.log('Updated demo_user password');
        }

        // Delete existing stories for this user to start fresh
        await Story.deleteMany({ author: user._id });

        const demoStories = [
            { title: "Shadow of the Dragon", genre: "Fantasy", description: "A young warrior discovers his true heritage." },
            { title: "Neon Nights", genre: "Sci-Fi", description: "Cyberpunk adventures in a rain-slicked city." },
            { title: "Whispers of the Heart", genre: "Romance", description: "A timeless love story across generations." },
            { title: "The Last Alchemist", genre: "Action", description: "Magic meets science in a battle for survival." },
            { title: "Haunted Manor", genre: "Horror", description: "A group of friends spend a night in a cursed house." },
            { title: "Sky Pirates", genre: "Adventure", description: "Sailing the clouds in search of lost treasure." },
            { title: "Undercover High", genre: "Comedy", description: "A 30-year-old cop goes back to high school." },
            { title: "Galactic Bounty", genre: "Sci-Fi", description: "The universe's most wanted man is on the run." },
            { title: "Eternal Blade", genre: "Action", description: "A legendary sword seeking its rightful owner." },
            { title: "Ocean's Secret", genre: "Mystery", description: "What lies beneath the deep blue sea?" }
        ];

        for (const s of demoStories) {
            const story = new Story({
                ...s,
                authorId: user._id.toString(),
                authorName: user.username,
                views: Math.floor(Math.random() * 5000),
                rating: (Math.random() * 2 + 3).toFixed(1),
                status: 'Live',
                panels: [
                    "https://im.runware.ai/image/os/a01d21/ws/3/ii/46655d4c-ae6e-4f03-87f4-9a316cddd64f.jpg",
                    "https://im.runware.ai/image/os/a04d20/ws/3/ii/f01ab47a-2f8b-4161-a6ba-810468fcb9fd.jpg"
                ]
            });
            await story.save();
        }

        console.log('Successfully seeded 10 stories for demo_user');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDemoUser();
