import express from "express";
import dotenv from "dotenv";
import agenda from "./agenda"; 
import connectDB from "../config/db"; 

dotenv.config();

const PORT = process.env.PORT || 3001; 
const app = express();

connectDB().then(async () => {
  await agenda.start();
  console.log("⚙️ Agenda started and running...");

  app.get("/", (req, res) => {
    res.send("Agenda worker is alive!");
  });

  app.listen(PORT, () => {
    console.log(`🟢 Dummy server listening on port ${PORT}`);
  });
});
