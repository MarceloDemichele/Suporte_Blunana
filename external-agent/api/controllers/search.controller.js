"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSources = listSources;
exports.search = search;
function listSources(req, res) {
    return res.json({
        sources: [
            ".memory",
            "knowledge",
            "docs",
            "index",
            "tickets",
            "support",
            "outputs",
            "engenharia-reversa"
        ]
    });
}
function search(req, res) {
    return res.json({
        ok: true,
        query: req.body.query
    });
}
