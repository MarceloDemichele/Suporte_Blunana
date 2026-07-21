"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const router = (0, express_1.Router)();
router.get("/sources", search_controller_1.listSources);
router.post("/search", search_controller_1.search);
exports.default = router;
