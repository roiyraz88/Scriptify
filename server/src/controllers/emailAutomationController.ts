import { Request, Response } from "express";
import { generatePythonScriptFromPrompt } from "../services/gemini";
import { validatePromptWithAI } from "../services/promptValidator";
import GeneratedScript from "../models/GeneratedScript";
import { runPythonScript } from "../utils/runPythonScript";

export const handleEmailAutomation = async (req: Request, res: Response) => {
  const { prompt, category } = req.body;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ message: "Prompt is too short." });
  }

  if (category !== "email_automation") {
    return res.status(400).json({ message: "Invalid category for this route." });
  }

  try {
    const isValid = await validatePromptWithAI(prompt);
    if (!isValid) {
      return res.status(400).json({
        message: "Prompt is not valid for script generation.",
      });
    }

    const script = await generatePythonScriptFromPrompt(prompt);

    const newScript = await GeneratedScript.create({
      user: (req as any).userId,
      prompt,
      category,
      script,
    });

    // 🏃‍♂️ הרצת הסקריפט מידית
    const output = await runPythonScript(script);

    return res.status(200).json({
      message: "✅ Script generated and executed successfully",
      script: newScript.script,
      output,
    });
  } catch (error) {
    console.error("Email Automation Error:", error);
    return res.status(500).json({
      message: "❌ Failed to generate or run script",
      error: (error as Error).message,
    });
  }
};
