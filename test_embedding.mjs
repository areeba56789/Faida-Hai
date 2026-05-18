import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
ai.models.embedContent({model: 'text-embedding-004', contents: 'hello'})
  .then(res => console.log('Success:', res.embeddings[0].values.slice(0, 5)))
  .catch(e => console.error('Error:', e.message));
