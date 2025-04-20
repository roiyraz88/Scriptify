import dotenv from "dotenv";
dotenv.config();

import agenda from "./agenda";
import connectDB from "../config/db";

const startAgendaWorker = async () => {
  await connectDB();
  console.log("🟢 MongoDB connected (Agenda Worker)");

  await agenda.start();
  console.log("⚙️ Agenda started and running...");
};

startAgendaWorker().catch((err) => {
  console.error("❌ Failed to start Agenda worker:", err);
});
