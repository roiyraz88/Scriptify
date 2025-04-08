import mongoose from "mongoose";

const jobAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  frequency: { type: String, enum: ["hourly", "daily", "morning", "manual"], default: "daily" },
  lastRun: { type: Date, default: null },
});

export default mongoose.model("JobAlert", jobAlertSchema);
