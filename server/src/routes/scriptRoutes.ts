import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import { runScriptForUser } from "../controllers/scriptRunner";

const router = express.Router();

router.post("/run-script", requireAuth, runScriptForUser);

export default router;
