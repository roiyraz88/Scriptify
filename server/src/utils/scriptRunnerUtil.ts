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
  html: string;
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
      num: Math.max(20, resultLimit * 2),
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

  return filteredResults.slice(0, resultLimit);
};

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
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
    html,
  });
};

export const formatResultsForEmail = (results: any[], query: string): string => {
  const items = results.map(
    (result, i) => `
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0;">${i + 1}. ${result.title}</h3>
        <p style="margin: 4px 0;">
          <a href="${result.link}" target="_blank" style="color: #1a73e8;">🔗 ${result.link}</a>
        </p>
        <p style="margin: 4px 0; color: #444;">${result.snippet || ""}</p>
      </div>
    `
  );

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">🔎 Job Alert Results for "<em>${query}</em>"</h2>
      ${items.join("")}
      <p style="margin-top: 32px; font-size: 12px; color: #888;">This email was sent automatically by Scriptify 🚀</p>
    </div>
  `;
};
