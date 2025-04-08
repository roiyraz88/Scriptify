import cron from "node-cron";
import JobAlert from "../models/jobAlertModel";
import axios from "axios";

export const startJobAlertRunner = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("[JobRunner] Checking job alerts...");

    const alerts = await JobAlert.find({});

    for (const alert of alerts) {
      const now = new Date();

      const shouldRun =
        alert.frequency === "hourly" ||
        (alert.frequency === "daily" && isMoreThanHours(alert.lastRun, 24)) ||
        (alert.frequency === "morning" && isMorning(now) && isMoreThanHours(alert.lastRun, 24));

      if (!shouldRun) continue;

      try {
        await axios.post("https://scriptify-aa88.onrender.com/api/scripts/run-script", {
          email: alert.email,
          query: alert.query,
        });

        alert.lastRun = now;
        await alert.save();
        console.log(`[JobRunner] Ran script for ${alert.email}`);
      } catch (err) {
        console.error("JobRunner error:", err);
      }
    }
  });
};

// פונקציות עזר
function isMoreThanHours(lastRun: Date, hours: number) {
  if (!lastRun) return true;
  const diff = (Date.now() - new Date(lastRun).getTime()) / (1000 * 60 * 60);
  return diff >= hours;
}

function isMorning(date: Date) {
  const hour = date.getHours();
  return hour >= 6 && hour < 10;
}
