import axios from "axios";
import nodemailer from "nodemailer";

interface JobSearchOptions {
  query: string;
  customization: string;
  resultLimit: number;
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string; // <-- נכון
}

export const searchJobsOnGoogle = async ({
  query,
  customization = "",
  resultLimit = 10,
}: JobSearchOptions) => {
  const SERP_API_KEY = process.env.SERP_API_KEY!;
  const safeCustomization = customization.toLowerCase();

  const includesLocation =
    safeCustomization.includes("israel") || safeCustomization.includes("tel aviv");

  const locationAddition = includesLocation ? "" : "Israel";
  const fullQuery = `${query} ${customization} ${locationAddition}`;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: fullQuery,
      api_key: SERP_API_KEY,
      num: Math.max(30, resultLimit * 2),
    },
  });

  const results = response.data.organic_results || [];

  const filteredResults = results.filter((r: any) => {
    const link = r.link?.toLowerCase() || "";
    return link.includes("job") || link.includes("position");
  });

  return filteredResults.slice(0, resultLimit);
};

export const sendEmail = async ({ to, subject, text }: EmailOptions) => {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
  if (!SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY is missing from environment variables.");
    throw new Error("Missing SendGrid API Key");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY,
      },
    });

    const info = await transporter.sendMail({
      from: "Scriptify Bot <bot.scriptify@gmail.com>",
      to,
      subject,
      text,
    });

    console.log("📧 Email sent successfully:", info.messageId);
  } catch (err: any) {
    console.error("❌ Failed to send email:", err.message || err);
    throw new Error("Email sending failed");
  }
};

export const formatResultsForEmail = (results: any[], query: string): string => {
  const items = results.map((result, i) => {
    return `${i + 1}. ${result.title || "No title"}
Link: ${result.link || "No link"}
${result.snippet || ""}
---------------------------`;
  });

  return `
🔎 Job Alert Results for "${query}"

${items.join("\n")}

--
This email was sent automatically by Scriptify 🚀
  `.trim();
};
