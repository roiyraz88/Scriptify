import axios from "axios";
import nodemailer from "nodemailer";

interface JobSearchOptions {
  query: string;
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
      q: `${query} posted last 24 hours`,
      api_key: SERP_API_KEY,
    },
  });

  const results = response.data.organic_results || [];
  return results.slice(0, resultLimit);
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

/**
 * Format search results into plain text for emails
 */
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
