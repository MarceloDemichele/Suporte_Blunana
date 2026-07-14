import express from "express";

import "../../config/loadEnv";
import healthRoutes from "./routes/health.routes";
import assistantRoutes from "./routes/assistant.routes";

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use("/", healthRoutes);
app.use("/", assistantRoutes);

const port = Number(process.env.PORT || process.env.AGENT_PORT || 3333);

app.listen(port, () => {
  console.log(`External Agent API rodando em http://localhost:${port}`);
});