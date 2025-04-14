import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_VALIDATION_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const validatePromptWithAI = async (customAddition: string): Promise<boolean> => {
  try {
    const validationPrompt = `
You are a validation assistant for a platform that generates job alert scripts using Python.

Each script searches for job postings using SerpAPI and sends them via Gmail (using smtplib).
The user is allowed to add a small custom instruction to improve the script.

You must validate that this custom instruction:
✅ Is relevant to job alerts (e.g., filtering jobs, formatting output, adding specific keywords)
✅ Does NOT require any additional APIs or services
✅ Does NOT request to use web scraping
✅ Does NOT require secret API keys beyond "SERP_API_KEY" or "EMAIL_APP_PASSWORD"
✅ Does NOT access the user's system or private files
✅ Does NOT attempt to automate system processes

Respond with ONLY:
- YES (if the user's addition is allowed)
- NO (if it is not allowed)

User’s custom addition:
"""${customAddition}"""
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
    return aiReply === "YES";
  } catch (error: Error | any) {
    console.error("Prompt validation error:", error?.response?.data || error.message);
    return false;
  }
};
