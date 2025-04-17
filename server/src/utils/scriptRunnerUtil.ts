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
  const searchEngines = [
    `site:www.comeet.com/jobs ${query}`,
    `site:www.jobinfo.co.il ${query}`,
    `site:www.glassdoor.com ${query}`,
  ];

  const allResults: any[] = [];

  for (const q of searchEngines) {
    try {
      const res = await axios.get("https://serpapi.com/search", {
        params: {
          engine: "google",
          q,
          api_key: SERP_API_KEY,
          gl: "il",
          hl: "en",
          num: resultLimit,
        },
      });

      const results = res.data.organic_results || [];

      const filtered = results.filter((r: any) => {
        if (!r.title || !r.link) return false;

        const link = r.link.toLowerCase();
        const title = r.title.toLowerCase();

        const isJobLink =
          link.includes("jobs") ||
          link.includes("career") ||
          link.includes("apply") ||
          link.includes("commeet") ||
          link.includes("jobinfo") ||
          link.includes("glassdoor") ||
          link.includes("job-openings") ||
          link.includes("recruit") ||
          link.includes("hiring");

        const isNotGeneralContent =
          !link.includes("blog") &&
          !link.includes("what-is") &&
          !link.includes("guide") &&
          !title.includes("what is") &&
          !title.includes("how to") &&
          !title.includes("salary") &&
          !title.includes("roadmap");

        return isJobLink && isNotGeneralContent;
      });

      allResults.push(...filtered);
    } catch (err) {
      console.error(`❌ Error fetching results for query: ${q}`, err);
    }
  }

  // הסר כפילויות לפי לינק
  const uniqueResults = allResults.filter(
    (result, index, self) =>
      index === self.findIndex((r) => r.link === result.link)
  );

  // החזר רק עד resultLimit תוצאות
  return uniqueResults.slice(0, resultLimit);
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
