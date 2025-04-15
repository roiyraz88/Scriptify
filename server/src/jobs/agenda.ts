import Agenda, { Job } from "agenda";
import Script from "../models/Script";
import User from "../models/User";
import {
  searchJobsOnGoogle,
  formatResultsForEmail,
  sendEmail,
} from "../utils/scriptRunnerUtil";
import dotenv from "dotenv";
import { DateTime } from "luxon";

dotenv.config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI!,
    collection: "agendaJobs",
  },
});

interface JobData {
  scriptId: string;
}

interface JobResult {
  title: string;
  link: string;
}

// הגדרת המשימה שתתבצע בזמן שנקבע
agenda.define("run-job-alert-script", async (job: Job<JobData>) => {
  const { scriptId } = job.attrs.data;

  const script = await Script.findById(scriptId);
  if (!script) return;

  const user = await User.findById(script.owner);
  if (!user?.email) return;

  const results: JobResult[] = await searchJobsOnGoogle({
    query: script.query,
    resultLimit: script.resultLimit,
    customization: script.customization || "",
  });

  if (!results.length) return;

  const emailBody = formatResultsForEmail(results, script.query);

  await sendEmail({
    to: user.email,
    subject: `🔁 Job Alert for "${script.query}"`,
    text: `${emailBody}\n\n(Automated by Scriptify 🚀)`,
  });
});

// הפונקציה שמחזירה ביטוי cron מתאים לפי סוג התזמון
export const getCronString = (
  frequencyType: string,
  time: string,
  weeklyDay?: string
): string => {
  const [hour, minute] = time.split(":").map(Number);

  const localTime = DateTime.fromObject({ hour, minute }, {
    zone: "Asia/Jerusalem",
  });
  const utcTime = localTime.toUTC();

  if (frequencyType === "Every day") {
    // כל יום באותה שעה
    return `${utcTime.minute} ${utcTime.hour} * * *`;
  }

  if (frequencyType === "Every week" && weeklyDay) {
    const daysMap: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const dayOfWeek = daysMap[weeklyDay];
    return `${utcTime.minute} ${utcTime.hour} * * ${dayOfWeek}`;
  }

  return "* * * * *";
};

export default agenda;
