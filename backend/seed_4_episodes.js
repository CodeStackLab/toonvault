const mongoose = require('mongoose');
const Story = require('./models/Story');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/toonvault';

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB:', mongoUri);
    const stories = await Story.find({});
    console.log(`Found ${stories.length} stories in database.`);

    for (const story of stories) {
      console.log(`Updating episodes for: "${story.title}" (${story._id})`);

      const basePanels = story.panels && story.panels.length > 0 
        ? story.panels 
        : ['/trust_the_stranger.png', '/seraphina_crown.png', '/into_starfall.png', '/villains_heart.png', '/code_rebirth.png'];

      const episodes = [
        {
          number: 1,
          title: "Episode 1: The Beginning of the Journey",
          description: "The story begins with a fateful decision that changes everything.",
          panels: [
            basePanels[0] || '/trust_the_stranger.png',
            basePanels[1] || '/seraphina_crown.png',
            basePanels[2] || '/into_starfall.png'
          ],
          content: JSON.stringify([
            { speaker: "Narration", text: "In a world bound by hidden powers, destiny awakens." },
            { speaker: "Hero", text: "I never expected my choice would open the vault..." },
            { speaker: "Companion", text: "Whatever lies ahead, we walk this path together." }
          ]),
          choices: [
            { text: "Follow the glowing runes into the ancient vault", votes: 342 },
            { text: "Seek answers from the Guild Master first", votes: 189 }
          ],
          scenes: [
            {
              number: 1,
              title: "Awakening",
              panels: [basePanels[0] || '/trust_the_stranger.png'],
              content: "The ancient seal cracks open as light spills across the stone chamber."
            }
          ]
        },
        {
          number: 2,
          title: "Episode 2: Whispers in the Shadows",
          description: "Secret alliances form as hidden enemies move in the background.",
          panels: [
            basePanels[1] || '/seraphina_crown.png',
            basePanels[3] || '/villains_heart.png',
            basePanels[0] || '/trust_the_stranger.png'
          ],
          content: JSON.stringify([
            { speaker: "Narration", text: "Shadows lengthen across the city as twilight falls." },
            { speaker: "Rival", text: "You don't understand the power you've unleashed!" },
            { speaker: "Hero", text: "Then teach me before it's too late." }
          ]),
          choices: [
            { text: "Trust the shadowy informant", votes: 512 },
            { text: "Rely only on your own instincts", votes: 420 }
          ],
          scenes: [
            {
              number: 1,
              title: "The Midnight Encounter",
              panels: [basePanels[1] || '/seraphina_crown.png'],
              content: "A figure emerges from the dark alleyway holding a glowing talisman."
            }
          ]
        },
        {
          number: 3,
          title: "Episode 3: The Crimson Oracle",
          description: "A mysterious oracle reveals a truth that shatters everything.",
          panels: [
            basePanels[2] || '/into_starfall.png',
            basePanels[4] || '/code_rebirth.png',
            basePanels[1] || '/seraphina_crown.png'
          ],
          content: JSON.stringify([
            { speaker: "Oracle", text: "Three paths lie before you. Only one leads to survival." },
            { speaker: "Hero", text: "I'll carve my own path if I must." }
          ]),
          choices: [
            { text: "Accept the Oracle's prophecy", votes: 610 },
            { text: "Defy the fate foretold in the blood moon", votes: 890 }
          ],
          scenes: [
            {
              number: 1,
              title: "The Oracle's Sanctum",
              panels: [basePanels[2] || '/into_starfall.png'],
              content: "Crimson flame burns softly in bronze braziers as ancient prophecies unfold."
            }
          ]
        },
        {
          number: 4,
          title: "Episode 4: Into the Starfall Rift",
          description: "The climactic battle begins as the dimensional rift tears open.",
          panels: [
            basePanels[3] || '/villains_heart.png',
            basePanels[0] || '/trust_the_stranger.png',
            basePanels[2] || '/into_starfall.png'
          ],
          content: JSON.stringify([
            { speaker: "Narration", text: "The sky fractures into brilliant crystal light." },
            { speaker: "Hero", text: "This is where our choices matter most." },
            { speaker: "Companion", text: "Together, to the end!" }
          ]),
          choices: [
            { text: "Unleash the full power of the Vault", votes: 1240 },
            { text: "Protect your companions at all costs", votes: 1450 }
          ],
          scenes: [
            {
              number: 1,
              title: "The Starfall Rift",
              panels: [basePanels[3] || '/villains_heart.png'],
              content: "Pure energy pulses through the air as the rift reaches critical mass."
            }
          ]
        }
      ];

      story.episodes = episodes;
      await story.save();
      console.log(`✅ Saved 4 episodes for "${story.title}"`);
    }

    console.log('🎉 ALL STORIES SUCCESSFULLY UPDATED WITH 4 EPISODES EACH!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error updating episodes:', err);
    process.exit(1);
  });
