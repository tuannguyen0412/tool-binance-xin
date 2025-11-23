import { GoogleGenAI, Type } from "@google/genai";
import { AiTone, RewriteConfig } from '../types';

// Initialize Gemini API client
// Ideally, this key comes from the user's environment or a secure setting in the app.
// For this demo, we assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const rewriteContent = async (
  content: string,
  config: RewriteConfig
): Promise<string> => {
  try {
    const prompt = `
      You are a professional crypto content creator for Binance Square.
      
      Task: Rewrite the following text.
      
      Target Audience: Crypto investors.
      Tone: ${config.tone}
      Language: ${config.language}
      Creativity Level: ${config.creativity}/10 (0 is strict, 10 is very creative).
      
      Rules:
      1. Make it engaging and natural.
      2. Use appropriate crypto terminology.
      3. If the tone is HYPE, use emojis.
      4. If the tone is EXPERT, use analytical language.
      5. Do not mention that you are an AI.
      
      Original Text:
      "${content}"
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: config.creativity / 10, // Map 0-10 to 0.0-1.0
      }
    });

    return response.text || "Error: No content generated.";
  } catch (error) {
    console.error("Gemini Rewrite Error:", error);
    return `Error rewriting content: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const generateSpinVersions = async (
  content: string,
  count: number = 5
): Promise<string[]> => {
  try {
    const prompt = `
      Generate ${count} distinct variations of the following crypto post.
      Each variation should have a slightly different angle but keep the core meaning.
      Return the result as a JSON array of strings.
      
      Text: "${content}"
    `;

    // Using structured output via schema for reliable JSON
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
        }
    });
    
    const text = response.text;
    if (!text) return [];
    
    // Parse the JSON response
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
        return parsed.map(String);
    }
    return [];

  } catch (error) {
    console.error("Gemini Spin Error:", error);
    return [];
  }
};