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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200, 
  })
);

app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/scripts", scriptRoutes);
app.use("/profile", profileRoutes);

export default app;
