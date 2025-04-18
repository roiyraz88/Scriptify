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
 
 
 app.use(
   cors({
     origin: (origin, callback) => {
       const allowed = [
         "http://localhost:5173",
         "https://scriptify-two-blue.vercel.app",
       ];
       if (!origin || allowed.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error("Not allowed by CORS"));
       }
     },
     credentials: true,
   })
 );
 
 app.get("/health", (req, res) => {
  res.send("✅ Backend is alive!");
});


 app.use(express.json());
 app.use(cookieParser());
 
 app.use("/auth", authRoutes);
 app.use("/scripts", scriptRoutes);
 app.use("/profile", profileRoutes);
 
 export default app;