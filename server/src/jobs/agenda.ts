import Agenda, { Job } from "agenda";
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

interface JobData {
  scriptId: string;
}

interface JobResult {
  title: string;
  link: string;
}

agenda.define("run-job-alert-script", async (job: Job<JobData>) => {
  const { scriptId } = job.attrs.data;

  const script = await Script.findById(scriptId);
  if (!script) return;

  const user = await User.findById(script.owner);
  if (!user?.email) return;

  let results: JobResult[] = await searchJobsOnGoogle({
    query: script.query,
    resultLimit: script.resultLimit,
    customization: script.customization || "", 
  });
  

  const newResults = results;

  if (!newResults.length) {
    return;
  }

  const emailBody = formatResultsForEmail(newResults, script.query);

  await sendEmail({
    to: user.email,
    subject: `🔁 Job Alert for "${script.query}"`,
    text: `${emailBody}\n\n(Automated by Scriptify 🚀)`,
  });

});

export default agenda;
