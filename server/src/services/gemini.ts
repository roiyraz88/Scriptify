import axios from "axios";
import { log } from "console";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

export const generatePythonScriptFromPrompt = async (
  userPrompt: string
): Promise<string> => {
  console.log(userPrompt);
  try {
    const fullPrompt = `
    You are a Python script generator designed to automate job alert emails.
    
    Context:
    - The user provides job-related keywords and optional filters (e.g., location, job type).
    - The script should use SerpAPI to search Google for relevant job postings based on these inputs.
    - Filter out general job listing pages and include only direct job result links.
    - The script should send the results via Gmail (use EMAIL_APP_PASSWORD) and save them in a local jobs.txt file.
    
    Constraints:
    - Use only the following environment variables: SERP_API_KEY and EMAIL_APP_PASSWORD.
    - Do NOT use any other external APIs or libraries besides 'requests' and 'smtplib'.
    - Do NOT use os.environ.get() for anything except these two variables.
    - Do NOT include explanations, markdown, or comments.
    - Output ONLY valid Python code (no markdown).
    
    User customization:
    """${userPrompt}"""
    `.trim();

    console.log("🧠 Sending prompt to Gemini...");
    const response = await axios.post(
      GEMINI_BASE_URL,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(
      "✅ Gemini raw response:",
      JSON.stringify(response.data, null, 2)
    );

    const raw =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const cleaned = raw
      ?.replace(/```(python)?/gi, "")
      .replace(/```/g, "")
      .trim();

    if (!cleaned) {
      console.warn("⚠️ Gemini returned empty or invalid content");
      return "print('No script generated')";
    }

    return cleaned;
  } catch (error: any) {
    console.error(
      "❌ Gemini API Error:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to generate script from Gemini AI");
  }
};
