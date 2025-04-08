import { Request, Response } from "express";
import axios from "axios";
import nodemailer from "nodemailer";
import Script from "../models/Script";
import User from "../models/User";

export const runScriptForUser = async (req: Request, res: Response) => {
  const {
    emailRecipient,
    query,
    resultLimit,
    frequencyType,
    dailyTime,
    weeklyDay,
    weeklyTime,
  } = req.body;

  if (!emailRecipient || !query || !frequencyType) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const SERP_API_KEY = process.env.SERP_API_KEY!;
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google",
        q: query,
        api_key: SERP_API_KEY,
      },
    });

    const results = response.data.organic_results || [];

    if (!results.length) {
      res.status(200).json({ message: "No job results found." });
      return;
    }

    const limit = Math.min(Number(resultLimit) || 10, 20);
    const topResults = results.slice(0, limit);

    const emailContent = topResults
      .map(
        (result: { title: string; link: string }, index: number) =>
          `${index + 1}. ${result.title}\n${result.link}`
      )
      .join("\n\n");

    let scheduleDescription = "";
    if (frequencyType === "Every day") {
      scheduleDescription = `Runs every day at ${dailyTime}`;
    } else if (frequencyType === "Every week") {
      scheduleDescription = `Runs every week on ${weeklyDay} at ${weeklyTime}`;
    }

    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY,
      },
    });

    await transporter.sendMail({
      from: "Scriptify Bot <bot.scriptify@gmail.com>",
      to: emailRecipient,
      subject: `🎯 Your Job Alerts for "${query}"`,
      text: `Here are the top ${topResults.length} job listings we found for "${query}":\n\n${emailContent}\n\n🔁 Schedule: ${scheduleDescription}`,
    });

    const script = await Script.create({
      owner: req.userId,
      emailRecipient,
      query,
      resultLimit,
      frequencyType,
      dailyTime,
      weeklyDay,
      weeklyTime,
    });
    
    // נוסיף למערך הסקריפטים של המשתמש
    await User.findByIdAndUpdate(req.userId , {
      $push: { scripts: script._id },
    });

    res.status(200).json({
      message: `✅ Sent job alert email with ${topResults.length} results to ${emailRecipient}`,
      schedule: scheduleDescription,
    });
    return;
  } catch (error) {
    console.error("Script run error:", error);
    res.status(500).json({ message: "❌ Failed to run job alert script" });
    return;
  }
};
