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

// חיפוש משרות בגוגל באמצעות SerpAPI עם סינון חכם
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

  const fullQuery = `site:linkedin.com/jobs OR site:glassdoor.com OR site:www.comeet.com/jobs "${query}" "${customization}" "${locationAddition}"`;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: fullQuery,
      api_key: SERP_API_KEY,
      num: resultLimit + 10, // נוסיף עוד תוצאות לטובת סינון
    },
  });

  const allResults = response.data.organic_results || [];

  // סינון תוצאות לא רלוונטיות (כמו רשימות)
  const filteredResults = allResults.filter((result: any) => {
    const title = result.title?.toLowerCase() || "";
    const link = result.link?.toLowerCase() || "";

    const looksLikeList = /\b\d{1,3}\s+(jobs|positions|משרות|מקומות|משרות פנויות)\b/.test(title);
    const looksLikeRealJob =
      link.includes("linkedin.com/jobs/view") ||
      link.includes("glassdoor.com/job") ||
      link.includes("comeet.com/jobs") ||
      link.includes("/job");

    return !looksLikeList && looksLikeRealJob;
  });

  return filteredResults.slice(0, resultLimit);
};

// שליחת מייל טקסטואלי פשוט
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
    from: "Scriptify Bot <bot.scriptify@gmail.com>",
    to,
    subject,
    text,
  });

  console.log(`📧 Email sent to ${to}`);
};

// הפיכת התוצאות למייל טקסט פשוט
export const formatResultsForEmail = (results: any[], query: string): string => {
  const topResults = results.map(
    (result, i) => `${i + 1}. ${result.title}\n${result.link}`
  );

  return `Here are the top ${
    topResults.length
  } job listings for "${query}":\n\n${topResults.join("\n\n")}`;
};
