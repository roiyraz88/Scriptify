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

export const searchJobsOnGoogle = async ({
  query,
  resultLimit = 10,
}: {
  query: string;
  resultLimit?: number;
}) => {
  const SERP_API_KEY = process.env.SERP_API_KEY!;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: query, 
      api_key: SERP_API_KEY,
      num: resultLimit,
      gl: "il", 
      hl: "en", 
    },
  });

  const results = response.data.organic_results || [];
  return results.filter((r: any) => r.title && r.link);
};

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
    from: "Scriptify Bot <no-reply@scriptify.online>", 
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
