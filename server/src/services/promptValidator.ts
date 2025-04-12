import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_VALIDATION_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const validatePromptWithAI = async (prompt: string): Promise<boolean> => {
  try {
    const validationPrompt = `
You are a validation assistant for a Python automation platform.

Only accept prompts that can be implemented using:
- Gmail (via smtplib) for sending emails
- Google search (via SerpAPI) for public job or content queries

❌ Do NOT accept prompts that require:
- Any other external API (such as OpenWeatherMap, CoinGecko, etc.)
- Any use of os.environ.get(...) to fetch API keys
- Installation of external packages like requests or beautifulsoup

Respond with ONLY:
- YES (if the prompt is allowed)
- NO (if the prompt is not allowed)

User prompt:
"""${prompt}"""
    `.trim();

    const response = await axios.post(
      GEMINI_VALIDATION_URL,
      {
        contents: [{ parts: [{ text: validationPrompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();
    console.log("🔍 AI validation reply:", aiReply);
    return aiReply === "YES";
  } catch (error: Error | any) {
    console.error("Prompt validation error:", error?.response?.data || error.message);
    return false;
  }
};

