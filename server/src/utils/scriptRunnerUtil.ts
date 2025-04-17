import axios from "axios";
import nodemailer from "nodemailer";

interface JobSearchOptions {
  query: string;
  customization: string;
  resultLimit?: number;
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

// חיפוש משרות בגוגל באמצעות SerpAPI (ללא סינון)
export const searchJobsOnGoogle = async ({
  query,
  customization,
  resultLimit = 10,
}: JobSearchOptions) => {
  const SERP_API_KEY = process.env.SERP_API_KEY!;
  const safeCustomization = customization.toLowerCase();

  const includesLocation =
    safeCustomization.includes("israel") || safeCustomization.includes("tel aviv");

  const locationAddition = includesLocation ? "" : "Israel";

  const fullQuery = `
    site:comeet.com/jobs OR
    site:jobs.lever.co OR
    site:boards.greenhouse.io OR
    site:jobs.recruitee.com OR
    site:jobs.ashbyhq.com
    "${query}" "${customization}" "${locationAddition}"
  `;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: fullQuery,
      api_key: SERP_API_KEY,
      num: resultLimit + 10,
    },
  });

  const allResults = response.data.organic_results || [];

  console.log("🔍 Raw results from SerpAPI:", allResults.length);

  return allResults.slice(0, resultLimit);
};

// שליחת מייל טקסטואלי פשוט מ־Scriptify
export const sendEmail = async ({ to, subject, text }: EmailOptions) => {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
  if (!SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY is missing.");
    throw new Error("Missing SendGrid API Key");
  }

  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: SENDGRID_API_KEY,
    },
  });

  await transporter.sendMail({
    from: "Scriptify Bot <no-reply@scriptify.online>", // ✅ שימוש בדומיין המאומת
    to,
    subject,
    text,
  });

  console.log(`📧 Email sent to ${to}`);
};

// הפיכת תוצאות למייל טקסט פשוט
export const formatResultsForEmail = (
  results: any[],
  query: string
): string => {
  const topResults = results.map(
    (result, i) => `${i + 1}. ${result.title}\n${result.link}`
  );

  return `Here are the top ${
    topResults.length
  } job listings for "${query}":\n\n${topResults.join("\n\n")}`;
};
