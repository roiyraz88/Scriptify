import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import scriptRoutes from "./routes/scriptRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://scriptify-two-blue.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));



app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/scripts", scriptRoutes);
app.use("/profile", profileRoutes);

export default app;
