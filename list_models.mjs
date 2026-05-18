import { GoogleGenAI } from '@google/genai';
async function run() {
  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
  try {
    const res = await ai.models.embedContent({model: 'text-embedding-004', contents: 'hello'});
    console.log('004 ok');
  } catch (e) {
    console.log('004 failed:', e.message);
  }
}
run();
