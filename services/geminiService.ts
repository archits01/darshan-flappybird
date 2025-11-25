import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely. 
// Note: In a production frontend-only app without a backend proxy, 
// exposing the key is risky. For this demo, we assume the environment variable is injected.
const ai = new GoogleGenAI({ apiKey });

export const getNewsAnchorCommentary = async (score: number): Promise<string> => {
  if (!apiKey) return "Breaking News: API Key missing, but the bird is still flying!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a chaotic, loud, and slightly sarcastic TV news anchor for a channel called "TV9". 
      A player just finished a round of a "Flappy Face" game where they dodge TV9 logos.
      
      The player's score was: ${score}.
      
      (Context: Score < 5 is terrible, 5-20 is average, 20+ is legendary).
      
      Give me a ONE sentence "Breaking News" ticker update roasting or praising their performance. 
      Keep it punchy, funny, and relevant to a news broadcast.`,
    });

    return response.text?.trim() || "Breaking News: Signal lost...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Breaking News: Technical difficulties in the newsroom!";
  }
};