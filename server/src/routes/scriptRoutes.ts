import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import { generateScriptController } from "../controllers/generateScriptController";

const router = express.Router();

router.post("/generate", requireAuth, async (req, res) => {
  generateScriptController(req, res);
});

export default router;
