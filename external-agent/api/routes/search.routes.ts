import { Router } from "express";
import { listSources, search } from "../controllers/search.controller";

const router = Router();

router.get("/sources", listSources);
router.post("/search", search);

export default router;