import Agenda, { Job, JobAttributesData } from "agenda";
import Script from "../models/Script";
import User from "../models/User";
import {
  searchJobsOnGoogle,
  formatResultsForEmail,
  sendEmail,
} from "../utils/scriptRunnerUtil";
import dotenv from "dotenv";

dotenv.config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI!,
    collection: "agendaJobs",
  },
});

type JobData = JobAttributesData & {
  scriptId: string;
};

interface JobResult {
  title: string;
  link: string;
}

agenda.define<JobData>("run-job-alert-script", async (job: Job<JobData>) => {
  console.log(`🚀 Job started at ${new Date().toLocaleString()}`);
  const { scriptId } = job.attrs.data;

  const script = await Script.findById(scriptId);
  if (!script) return;

  const user = await User.findById(script.owner);
  if (!user?.email) return;

  const results: JobResult[] = await searchJobsOnGoogle({
    query: script.query,
    resultLimit: script.resultLimit,
  });

  if (!results.length) return;

  const emailBody = formatResultsForEmail(results, script.query);
  await sendEmail({
    to: user.email,
    subject: `🔁 Job Alert for "${script.query}"`,
    text: `${emailBody}\n\n(Automated by Scriptify 🚀)`,
  });
});

export default agenda;
