import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import { generateJobAlert } from "../controllers/scriptController";

const router = express.Router();

router.post("/generate-job-alert", requireAuth, generateJobAlert);

export default router;
