import { Router } from "express";
import { askAgent } from "../controllers/agent.controller";

const router = Router();

router.post("/ask", askAgent);

export default router;