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
  text: string;
}

export const searchJobsOnGoogle = async ({
  query,
  customization,
  resultLimit = 1,
}: JobSearchOptions) => {
  const SERP_API_KEY = process.env.SERP_API_KEY!;

  const includesLocation =
    customization.toLowerCase().includes("israel") ||
    customization.toLowerCase().includes("tel aviv");

  const locationAddition = includesLocation ? "" : "Israel";
  const fullQuery = `site:www.comeet.com/jobs "${query}" "${customization}" "${locationAddition}"`;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: fullQuery,
      api_key: SERP_API_KEY,
      num: Math.max(20, resultLimit * 2)
    },
  });

  const results = response.data.organic_results || [];

  const filteredResults = results.filter((r: any) => {
    const title = r.title?.toLowerCase() || "";
    const link = r.link?.toLowerCase() || "";

    const isListPage =
      /\b\d{1,4}\s+(jobs|positions|משרות|מקומות)\b/.test(title) ||
      /\/jobs\/?$/.test(link);

    const isJobPage =
      link.includes("linkedin.com/jobs/view") ||
      link.includes("glassdoor.com/job") ||
      link.includes("comeet.com/jobs/") ||
      link.includes("/job/");

    return !isListPage && isJobPage;
  });

  return filteredResults.slice(0, resultLimit); // מחזיר לפי הכמות שביקש המשתמש
};

export const sendEmail = async ({ to, subject, text }: EmailOptions) => {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;

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
};

export const formatResultsForEmail = (results: any[], query: string): string => {
  const topResults = results.map(
    (result, i) =>
      `${i + 1}. ${result.title}\n🔗 ${result.link}\n📝 ${result.snippet || ""}`
  );

  return `Here ${topResults.length === 1 ? "is" : "are"} your job alert${topResults.length === 1 ? "" : "s"} for "${query}":\n\n${topResults.join("\n\n")}`;
};
