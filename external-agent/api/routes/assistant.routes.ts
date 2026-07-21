import { Router } from "express";
import { assistant, assistantFeedback } from "../controllers/assistant.controller";

const router = Router();

router.post("/assistant", assistant);
router.post("/assistant/feedback", assistantFeedback);

export default router;
