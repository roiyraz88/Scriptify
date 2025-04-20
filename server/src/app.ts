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
  "https://scriptify-two-blue.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
 
 app.get("/health", (req, res) => {
  res.send("✅ Backend is alive!");
});


 app.use(express.json());
 app.use(cookieParser());
 
 app.use("/auth", authRoutes);
 app.use("/scripts", scriptRoutes);
 app.use("/profile", profileRoutes);
 
 export default app;