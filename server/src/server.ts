import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";
import { startJobAlertRunner } from "./utils/jobRunner";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    startJobAlertRunner(); 
  });
});
