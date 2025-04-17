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

  if (frequencyType === "Every week" && !weeklyDay) {
    return res.status(400).json({ message: "weeklyDay is required for weekly frequency" });
  }

  try {
    console.log("🔍 Checking existing script...");
    const existing = await Script.findOne({ owner: (req as any).userId });
    if (existing) {
      return res.status(409).json({ message: "You already have a script." });
    }

    console.log("🔍 Searching for jobs...");
    const results = await searchJobsOnGoogle({
      query,
      customization,
      resultLimit,
    });

    if (!results.length) {
      return res.status(204).json({ message: "📭 No jobs found." });
    }

    const emailBody = formatResultsForEmail(results, query);
    const subject = `🎯 Your Job Alerts for "${query}"`;

    console.log("📧 Sending initial email...");
    await sendEmail({
      to: emailRecipient,
      subject,
      text: emailBody,
    });

    const scheduleDescription =
      frequencyType === "Every day"
        ? `Runs every day at ${executionTime}`
        : `Runs every week on ${weeklyDay} at ${executionTime}`;

    console.log("💾 Saving script to DB...");
    const script = await Script.create({
      owner: (req as any).userId,
      emailRecipient,
      query,
      resultLimit,
      frequencyType,
      executionTime,
      weeklyDay: frequencyType === "Every week" ? weeklyDay : undefined,
      customization,
    });

    console.log("📅 Scheduling job with Agenda...");
    const cronString = getCronString(frequencyType, executionTime, weeklyDay);
    await agenda.schedule(cronString, "run-job-alert-script", {
      scriptId: script._id,
    });

    console.log("👤 Updating user...");
    await User.findByIdAndUpdate((req as any).userId, {
      $push: { scripts: script._id },
    });

    // ⚠️ Gemini moved out of main flow (optional: run via Agenda)
    console.log("🧠 Generating script with Gemini (non-blocking)...");
    generatePythonScriptFromPrompt(
      `Search for job postings related to "${query}" using SerpAPI, and send the results to ${emailRecipient} via Gmail. ${customization || ""}`
    )
      .then((generatedScript) => {
        console.log("✅ Gemini script generated.");
        // אפשר לשמור אותו במסד אם רוצים
      })
      .catch((err) => {
        console.error("❌ Gemini generation failed:", err.message);
      });

    return res.status(200).json({
      message: `✅ Job alert created and email sent to ${emailRecipient}`,
      schedule: scheduleDescription,
      script,
    });
  } catch (error) {
    console.error("❌ Job Alert Error:", error);
    return res.status(500).json({ message: "❌ Failed to create job alert script" });
  }
};
