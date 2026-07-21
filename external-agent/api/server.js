"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("../../config/loadEnv");
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const assistant_routes_1 = __importDefault(require("./routes/assistant.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use("/", health_routes_1.default);
app.use("/", assistant_routes_1.default);
const port = Number(process.env.PORT || process.env.AGENT_PORT || 3333);
app.listen(port, () => {
    console.log(`External Agent API rodando em http://localhost:${port}`);
});
