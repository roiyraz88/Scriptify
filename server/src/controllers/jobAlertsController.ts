import { Request, Response } from "express";
import Script from "../models/Script";
import User from "../models/User";
import agenda from "../jobs/agenda";
import {
  searchJobsOnGoogle,
  formatResultsForEmail,
  sendEmail,
} from "../utils/scriptRunnerUtil";
import { generatePythonScriptFromPrompt } from "../services/gemini";
import { getCronString } from "../utils/cronHelper";

export const handleJobAlerts = async (req: Request, res: Response) => {
  const {
    emailRecipient,
    query,
    resultLimit,
    frequencyType,
    executionTime,
    weeklyDay,
    customization,
  } = req.body;

  if (!emailRecipient || !query || !frequencyType || !executionTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Optional: prevent duplicate script per user
    const existing = await Script.findOne({ owner: (req as any).userId });
    if (existing) {
      return res.status(409).json({ message: "You already have a script." });
    }

    const results = await searchJobsOnGoogle({
      query,
      customization,
      resultLimit,
    });

    if (!results.length) {
      return res.status(204).json({ message: "📭 No jobs found." });
    }

    const emailBody = formatResultsForEmail(results, query);
    const subject = `🎯 Your Job Alerts for \"${query}\"`;

    let scheduleDescription = "";
    if (frequencyType === "Every day") {
      scheduleDescription = `Runs every day at ${executionTime}`;
    } else if (frequencyType === "Every week" && weeklyDay) {
      scheduleDescription = `Runs every week on ${weeklyDay} at ${executionTime}`;
    }

    await sendEmail({
      to: emailRecipient,
      subject,
      text: `${emailBody}\n\n🔁 Schedule: ${scheduleDescription}`,
    });

    const basePrompt = `Search for job postings related to \"${query}\" using SerpAPI, and send the results to ${emailRecipient} via Gmail.`;
    const fullPrompt = customization ? `${basePrompt} ${customization.trim()}` : basePrompt;

    const generatedScript = await generatePythonScriptFromPrompt(fullPrompt);

    const script = await Script.create({
      owner: (req as any).userId,
      emailRecipient,
      query,
      resultLimit,
      frequencyType,
      executionTime,
      weeklyDay,
      customization,
    });

    try {
      const cronString = getCronString(frequencyType, executionTime, weeklyDay);
      await agenda.schedule(cronString, "run-job-alert-script", {
        scriptId: script._id,
      });
    } catch (err) {
      console.error("❌ Agenda schedule failed:", err);
      return res.status(500).json({ message: "Failed to schedule the job" });
    }

    await User.findByIdAndUpdate((req as any).userId, {
      $push: { scripts: script._id },
    });

    return res.status(200).json({
      message: `✅ Job alert created and email sent to ${emailRecipient}`,
      schedule: scheduleDescription,
      generatedScript,
      script,
    });
  } catch (error) {
    console.error("Job Alert Error:", error);
    return res.status(500).json({ message: "❌ Failed to create job alert script" });
  }
};
