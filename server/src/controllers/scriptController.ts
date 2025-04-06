import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Script from "../models/Script";
import { generateJobAlertScript } from "../services/scriptService";

export const generateJobAlert = async (req: Request, res: Response) => {
  const { serpApiKey, emailSender, emailPassword, emailRecipient, query } =
    req.body;
  const userId = req.userId;

  if (
    !serpApiKey ||
    !emailSender ||
    !emailPassword ||
    !emailRecipient ||
    !query
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const scriptText = generateJobAlertScript(
      serpApiKey,
      emailSender,
      emailPassword,
      emailRecipient,
      query
    );

    const fileName = `job_alert_${Date.now()}.py`;
    const filePath = path.join(__dirname, `../scripts/${fileName}`);

    fs.writeFileSync(filePath, scriptText);

    await Script.create({
      title: "Job Alert Script",
      filePath,
      type: "job-alert",
      user: userId,
    });

    res.download(filePath, fileName);
    return;
  } catch (error) {
    console.error("Error generating script:", error);
    res.status(500).json({ message: "Server error while generating script" });
    return;
  }
};
