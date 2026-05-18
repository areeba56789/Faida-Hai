import { GoogleGenAI } from '@google/genai';
async function run() {
  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
  try {
    const res = await ai.models.embedContent({model: 'gemini-embedding-2', contents: 'hello'});
    console.log('Success!', res.embeddings[0].values.slice(0, 5));
  } catch (e) {
    console.log('failed:', e.message);
  }
}
run();
