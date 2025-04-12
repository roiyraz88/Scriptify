import { Request, Response } from "express";
import { generatePythonScriptFromPrompt } from "../services/gemini";
import { validatePromptWithAI } from "../services/promptValidator";
import GeneratedScript from "../models/GeneratedScript";
import { runPythonScript } from "../utils/runPythonScript";

export const handleApiIntegration = async (req: Request, res: Response) => {
  const { prompt, category } = req.body;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ message: "Prompt is too short." });
  }

  if (category !== "api_integration") {
    return res.status(400).json({ message: "Invalid category for this route." });
  }

  try {
    const isValid = await validatePromptWithAI(prompt);
    if (!isValid) {
      return res.status(400).json({
        message: "Prompt does not describe a valid API integration task.",
      });
    }

    const script = await generatePythonScriptFromPrompt(prompt);

    const newScript = await GeneratedScript.create({
      user: (req as any).userId,
      prompt,
      category,
      script,
    });

    // 🏃‍♂️ הרצה מיידית של הסקריפט
    const output = await runPythonScript(script);

    return res.status(200).json({
      message: "✅ API integration script generated and executed",
      script: newScript.script,
      output,
    });
  } catch (error) {
    console.error("API Integration Error:", error);
    return res.status(500).json({
      message: "❌ Failed to generate or run API script",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
