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
  resultLimit = 10,
}: JobSearchOptions) => {
  const SERP_API_KEY = process.env.SERP_API_KEY!;

  const includesLocation =
    customization.toLowerCase().includes("israel") ||
    customization.toLowerCase().includes("tel aviv");

  const locationAddition = includesLocation ? "" : "Israel";

  const fullQuery = `site:linkedin.com/jobs OR site:glassdoor.com OR site:www.comeet.com/jobs "${query}" "${customization}" "${locationAddition}"`;

  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google",
      q: fullQuery,
      api_key: SERP_API_KEY,
      num: resultLimit + 10, // נוסיף קצת מרווח לסינון
    },
  });

  const allResults = response.data.organic_results || [];

  // סינון תוצאות לא רלוונטיות (כמו "17 משרות")
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
