import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const generatePythonScriptFromPrompt = async (userPrompt: string): Promise<string> => {
  try {
    const fullPrompt = `
You are an automated Python script generator for a platform that helps users automate tasks.

Only use the following services:
- Gmail (via smtplib) to send emails
- Public internet search via Google (already integrated using SerpAPI)

❌ Do NOT use any other external APIs such as OpenWeatherMap, CoinGecko, Alpha Vantage, etc.
❌ Do NOT generate code that uses os.environ.get(...) to retrieve external API keys.

Respond with ONLY valid and executable Python code. No explanations or markdown formatting.

User request:
"""${userPrompt}"""
    `.trim();

    const response = await axios.post(
      GEMINI_BASE_URL,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    const cleaned = raw?.replace(/```(python)?/gi, "").replace(/```/g, "").trim() || "print('Hello from AI')";

    return cleaned;
  } catch (error: any) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    throw new Error("Failed to generate script from Gemini AI");
  }
};



export const extractJobQueryFromPromptAI = async (userPrompt: string): Promise<string> => {
  try {
    const question = `Extract the specific job search topic from the user's request: "${userPrompt}". Respond with only the topic in a few words.`;

    const response = await axios.post(
      GEMINI_BASE_URL,
      {
        contents: [{ parts: [{ text: question }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "jobs";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("AI query extraction failed:", error.response?.data || error.message);
    } else {
      console.error("AI query extraction failed:", error);
    }
    return "jobs";
  }
};

export const classifyPromptCategoryWithAI = async (prompt: string): Promise<string | null> => {
  const CATEGORIES = ["emails", "scraping", "file IO", "api", "alerts"];

  const question = `
Your task is to classify the following user prompt into one of the allowed automation categories:
${CATEGORIES.join(", ")}.

Respond with only one category from the list. Do not explain.

User prompt:
"""${prompt}"""
`;

  try {
    const response = await axios.post(
      GEMINI_BASE_URL,
      {
        contents: [{ parts: [{ text: question }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
    return CATEGORIES.includes(result) ? result : null;
  } catch (error: any) {
    console.error("Prompt classification error:", error?.response?.data || error.message);
    return null;
  }
};
