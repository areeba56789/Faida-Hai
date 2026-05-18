import { GoogleGenAI } from '@google/genai';
async function run() {
  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
  try {
    const res = await ai.models.list();
    for await (const m of res) {
      if (m.name.includes('embed') || m.name.includes('Embed')) {
        console.log(m.name);
      }
    }
  } catch (e) {
    console.log('failed:', e.message);
  }
}
run();
