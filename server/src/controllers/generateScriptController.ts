import { Request, Response } from "express";
import { handleJobAlerts } from "./jobAlertsController";

export const generateScriptController = async (req: Request, res: Response) => {
  const {
    emailRecipient,
    query,
    resultLimit,
    frequencyType,
    executionTime,
    weeklyDay,
    customPrompt, 
  } = req.body;

  if (!emailRecipient || !query || !resultLimit || !frequencyType || !executionTime) {
    return res.status(400).json({ message: "Missing required fields for job alerts." });
  }

  try {
    return await handleJobAlerts(req, res);
  } catch (error) {
    console.error("Generate Script Error:", error);
    return res.status(500).json({ message: "Failed to generate or run script." });
  }
};
