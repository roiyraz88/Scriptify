import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const generatePythonScriptFromPrompt = async (userPrompt: string): Promise<string> => {
  try {
    const fullPrompt = `
You are a Python script generator for automating job alerts.

Your task:
- Use SerpAPI to search Google for job listings
- Use smtplib to email the results via Gmail
- Save the results in a .txt file
- Only use the environment variables: SERP_API_KEY and EMAIL_APP_PASSWORD

Restrictions:
- Do NOT use any other APIs
- Do NOT use os.environ.get() for anything except the two allowed keys

Output only valid Python code. No explanations or markdown.

User addition:
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
    const cleaned = raw?.replace(/```(python)?/gi, "").replace(/```/g, "").trim() || "print('No script generated')";
    return cleaned;
  } catch (error: any) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    throw new Error("Failed to generate script from Gemini AI");
  }
};
