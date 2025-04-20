import app from "./src/app";
import connectDB from "./src/config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
