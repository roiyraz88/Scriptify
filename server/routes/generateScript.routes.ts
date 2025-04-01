import { Router } from "express";
import { generateEmailScript } from "../controllers/scriptController";


const router = Router();

router.post("/generate-script", generateEmailScript);

export default router;