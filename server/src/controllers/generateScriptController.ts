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
  } = req.body;

  if (!emailRecipient || !query || !resultLimit || !frequencyType || !executionTime) {
    return res.status(400).json({ message: "Missing required fields for job alerts." });
  }

  if (frequencyType === "Every week" && !weeklyDay) {
    return res.status(400).json({ message: "weeklyDay is required when frequencyType is 'Every week'." });
  }

  try {
    return await handleJobAlerts(req, res);
  } catch (error) {
    console.error("Generate Script Error:", error);
    return res.status(500).json({ message: "Failed to generate or run script." });
  }
};
