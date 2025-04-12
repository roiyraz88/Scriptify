import app from "./src/app";
import connectDB from "./src/config/db";
import dotenv from "dotenv";
import agenda from "./src/jobs/agenda";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
    await agenda.start();
  });
});
