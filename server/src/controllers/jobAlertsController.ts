import { Request, Response } from "express";
import Script from "../models/Script";
import User from "../models/User";
import {
  searchJobsOnGoogle,
  formatResultsForEmail,
  sendEmail,
} from "../utils/scriptRunnerUtil";
import agenda from "../jobs/agenda";
import { getCronString } from "../utils/cronHelper";

export const handleJobAlerts = async (req: Request, res: Response) => {
  const {
    emailRecipient,
    query,
    resultLimit,
    frequencyType,
    executionTime,
    weeklyDay,
    category,
  } = req.body;

  if (!emailRecipient || !query || !frequencyType || !executionTime || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // קבלת משרות מה-24 שעות האחרונות בלבד
    const results = await searchJobsOnGoogle({ query, resultLimit });

    if (!results.length) {
      return res.status(200).json({ message: "📭 No jobs found in the last 24 hours." });
    }

    const emailBody = formatResultsForEmail(results, query);
    const subject = `🎯 Your Job Alerts for "${query}"`;

    let scheduleDescription = "";
    if (frequencyType === "Every day") {
      scheduleDescription = `Runs every day at ${executionTime}`;
    } else if (frequencyType === "Every week" && weeklyDay) {
      scheduleDescription = `Runs every week on ${weeklyDay} at ${executionTime}`;
    }

    // שליחת מייל מיידית עם התוצאות
    await sendEmail({
      to: emailRecipient,
      subject,
      text: `${emailBody}\n\n🔁 Schedule: ${scheduleDescription}`,
    });

    // יצירת הסקריפט במסד
    const script = await Script.create({
      owner: (req as any).userId,
      emailRecipient,
      query,
      resultLimit,
      frequencyType,
      executionTime,
      weeklyDay,
      category,
    });

    // תזמון הרצות עתידיות
    const cronString = getCronString(frequencyType, executionTime, weeklyDay);
    await agenda.schedule(cronString, "run-job-alert-script", { scriptId: script._id });

    // שיוך הסקריפט למשתמש
    await User.findByIdAndUpdate((req as any).userId, {
      $push: { scripts: script._id },
    });

    return res.status(200).json({
      message: `✅ Job alert created and email sent to ${emailRecipient}`,
      schedule: scheduleDescription,
    });
  } catch (error) {
    console.error("Job Alert Error:", error);
    return res.status(500).json({ message: "❌ Failed to create job alert script" });
  }
};
