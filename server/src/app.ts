import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import scriptRoutes from "./routes/scriptRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();

// const allowedOrigins = [
//   "http://localhost:5173",
//   process.env.FRONTEND_URL, 
// ];

app.use(
  cors({
    origin: 'https://scriptify-two-blue.vercel.app/',
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, default gateway!");
});


app.use("/api/auth", authRoutes);
app.use("/api/scripts", scriptRoutes);
app.use("/api/profile", profileRoutes); 

export default app;
