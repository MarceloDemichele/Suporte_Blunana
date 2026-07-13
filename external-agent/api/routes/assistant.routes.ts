import { Router } from "express";
import { assistant } from "../controllers/assistant.controller";

const router = Router();

router.post("/assistant", assistant);

export default router;