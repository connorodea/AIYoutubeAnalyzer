// FIX: Import HarmCategory and HarmBlockThreshold enums for safety settings.
import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
};

// FIX: Use HarmCategory and HarmBlockThreshold enums for safety settings.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = 'gemini-2.5-pro';

export const summarizeVideo = async (videoUrl: string): Promise<{ summary: string; chat: Chat }> => {
  const chat = ai.chats.create({
    model,
    // config is the same as generationConfig + safetySettings
    config: { ...generationConfig, safetySettings },
  });

  const prompt = `
    You are an expert YouTube video analyst. A user has provided the following video URL: ${videoUrl}

    Your first task is to provide a comprehensive summary of this video. Structure your response in Markdown format with the following sections:

    - **Main Topic:** Briefly describe the central theme of the video.
    - **Key Takeaways:** Use a bulleted list to highlight the most important points, insights, or events.
    - **Tone & Style:** Describe the video's overall feeling (e.g., educational, comedic, inspirational, technical).

    After this summary, add a friendly message inviting the user to ask any questions they have about the video.

    Base your analysis on your knowledge of the video's content, title, and creator. If you don't have specific knowledge, make an educated inference.
  `;

  const result = await chat.sendMessage({ message: prompt });
  return { summary: result.text, chat };
};

export const continueChat = async (chat: Chat, message: string): Promise<string> => {
  const result = await chat.sendMessage({ message });
  return result.text;
};
