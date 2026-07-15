"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = health;
function health(req, res) {
    return res.json({
        status: "ok",
        service: "external-agent-api",
        timestamp: new Date().toISOString()
    });
}
