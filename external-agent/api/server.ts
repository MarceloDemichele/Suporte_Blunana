import express from "express";

import healthRoutes from "./routes/health.routes";
import assistantRoutes from "./routes/assistant.routes";

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use("/", healthRoutes);
app.use("/", assistantRoutes);

const port = process.env.AGENT_PORT || 3333;

app.listen(port, () => {
  console.log(`External Agent API rodando em http://localhost:${port}`);
});