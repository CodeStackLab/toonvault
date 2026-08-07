const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const MISTRAL_KEY = process.env.MISTRAL_API_KEY || 'YyfYhkuBhuF2gQML0jlGnS6X0XrLloP7';
const RUNWARE_KEY = process.env.RUNWARE_API_KEY || 'pJWrGTD9NYgjxi30BnHrdupOQ4y3Ro3t';

async function generateAIStoryWith3Episodes() {
  console.log('🚀 Step 1: Requesting 3-Episode Manhwa Script from Mistral AI...');

  const systemPrompt = `You are a master Webtoon & Manhwa author. Output ONLY valid JSON containing:
{
  "title": "Story Title",
  "genre": "Romance",
  "description": "Engaging series description",
  "episodes": [
    {
      "number": 1,
      "title": "Episode 1 Title",
      "panels": [
        { "speaker": "Narration", "text": "Opening scene narration", "imagePrompt": "webtoon anime style, detailed scene instruction 1" },
        { "speaker": "Hero", "text": "Dialogue line 1", "imagePrompt": "webtoon anime style, detailed scene instruction 2" },
        { "speaker": "Heroine", "text": "Dialogue line 2", "imagePrompt": "webtoon anime style, detailed scene instruction 3" }
      ],
      "choices": [
        { "text": "Choice A text", "votes": 240 },
        { "text": "Choice B text", "votes": 180 }
      ]
    },
    {
      "number": 2,
      "title": "Episode 2 Title",
      "panels": [
        { "speaker": "Narration", "text": "Episode 2 narration", "imagePrompt": "webtoon anime style, detailed scene instruction 4" },
        { "speaker": "Hero", "text": "Dialogue line", "imagePrompt": "webtoon anime style, detailed scene instruction 5" },
        { "speaker": "Heroine", "text": "Dialogue line", "imagePrompt": "webtoon anime style, detailed scene instruction 6" }
      ],
      "choices": [
        { "text": "Choice A text", "votes": 410 },
        { "text": "Choice B text", "votes": 390 }
      ]
    },
    {
      "number": 3,
      "title": "Episode 3 Title",
      "panels": [
        { "speaker": "Narration", "text": "Episode 3 narration", "imagePrompt": "webtoon anime style, detailed scene instruction 7" },
        { "speaker": "Hero", "text": "Dialogue line", "imagePrompt": "webtoon anime style, detailed scene instruction 8" },
        { "speaker": "Heroine", "text": "Dialogue line", "imagePrompt": "webtoon anime style, detailed scene instruction 9" }
      ],
      "choices": [
        { "text": "Choice A text", "votes": 680 },
        { "text": "Choice B text", "votes": 520 }
      ]
    }
  ]
}`;

  const mistralResp = await axios.post('https://api.mistral.ai/v1/chat/completions', {
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Create a 3-episode interactive romance webtoon titled 'The Crown's Secret Vow'." }
    ],
    response_format: { type: "json_object" }
  }, { headers: { 'Authorization': `Bearer ${MISTRAL_KEY}` } });

  const storyScript = JSON.parse(mistralResp.data.choices[0].message.content);
  console.log(`✅ Mistral Script Created: "${storyScript.title}" with ${storyScript.episodes.length} episodes.`);

  // Collect all image prompts for Runware
  const allPrompts = [];
  storyScript.episodes.forEach(ep => {
    ep.panels.forEach(p => {
      allPrompts.push(p.imagePrompt);
    });
  });

  console.log(`\n🎨 Step 2: Generating ${allPrompts.length} High-Res Panels with Runware AI...`);

  const runwareTasks = [
    { taskType: "authentication", apiKey: RUNWARE_KEY },
    ...allPrompts.map(promptText => ({
      taskType: "imageInference",
      taskUUID: crypto.randomUUID(),
      model: "runware:100@1",
      positivePrompt: `masterpiece, best quality, webtoon anime style, vibrant colors, cinematic lighting, ${promptText}`,
      width: 512,
      height: 768,
      numberResults: 1,
      outputFormat: "JPG",
      CFGScale: 3.5,
      steps: 4
    }))
  ];

  const runwareResp = await axios.post('https://api.runware.ai/v1', runwareTasks);
  const generatedImages = (runwareResp.data?.data || [])
    .filter(d => d.taskType === "imageInference")
    .map(d => d.imageURL);

  console.log(`✅ ${generatedImages.length} Runware AI images generated!`);

  // Map generated image URLs back to episodes
  let imgIndex = 0;
  const processedEpisodes = storyScript.episodes.map(ep => {
    const epPanels = [];
    const epContentArray = [];

    ep.panels.forEach(p => {
      const url = generatedImages[imgIndex] || "/into_starfall.png";
      imgIndex++;
      epPanels.push(url);
      epContentArray.push({
        speaker: p.speaker,
        text: p.text,
        imageUrl: url
      });
    });

    return {
      number: ep.number,
      title: ep.title,
      panels: epPanels,
      content: JSON.stringify(epContentArray),
      choices: ep.choices
    };
  });

  const fullStory = {
    _id: "ai_real_" + Date.now(),
    title: storyScript.title,
    genre: storyScript.genre || "Romance",
    description: storyScript.description,
    authorName: "Mistral + Runware AI",
    cover: processedEpisodes[0].panels[0],
    panels: processedEpisodes[0].panels,
    episodes: processedEpisodes,
    rating: "4.9",
    views: 15200,
    likes: 3400
  };

  // Save into frontend JSON mock fallback file or memory
  const fs = require('fs');
  const path = 'd:/toonvault/frontend/public/ai_generated_story.json';
  fs.writeFileSync(path, JSON.stringify(fullStory, null, 2));

  console.log(`\n🎉 SUCCESS! Story & 3 Real AI Episodes Saved to ${path}!`);
  console.log(`Title: ${fullStory.title}`);
  console.log(`Episodes Count: ${fullStory.episodes.length}`);
  console.log(`First Panel Image: ${fullStory.panels[0]}`);
}

generateAIStoryWith3Episodes().catch(e => console.error('Generation Error:', e.message));
