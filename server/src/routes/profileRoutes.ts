import express from "express";
import {
  getMyScripts,
  deleteScript,
  updateScript,
} from "../controllers/profileController";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.get("/my-scripts", requireAuth, getMyScripts);

router.delete("/my-scripts/:id", requireAuth, deleteScript);

router.put("/my-scripts/:id", requireAuth, updateScript);

export default router;
