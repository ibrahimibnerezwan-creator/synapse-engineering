import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

export async function generateAI(parts: string | Part[], json = false): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('The AI service is unavailable. Enter the details manually or contact Sohel.');
  const client = new GoogleGenerativeAI(apiKey);
  const chain = (process.env.AI_MODEL_CHAIN?.split(',').map(item => item.trim()).filter(Boolean) || ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash-lite']).slice(0, 3);
  for (const name of chain) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = client.getGenerativeModel({ model: name, ...(json ? { generationConfig: { responseMimeType: 'application/json' } } : {}) }, { timeout: 8000 });
        const result = await model.generateContent(parts);
        const output = result.response.text();
        if (json) JSON.parse(output);
        if (output.trim()) return output;
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (attempt || !/503|429|high demand|overloaded|service unavailable|temporarily|timeout/i.test(message)) break;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }
  throw new Error('The AI is busy right now. Please try again or enter the details manually.');
}
