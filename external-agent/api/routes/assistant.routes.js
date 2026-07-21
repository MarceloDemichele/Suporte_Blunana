"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assistant_controller_1 = require("../controllers/assistant.controller");
const router = (0, express_1.Router)();
router.post("/assistant", assistant_controller_1.assistant);
router.post("/assistant/feedback", assistant_controller_1.assistantFeedback);
exports.default = router;
