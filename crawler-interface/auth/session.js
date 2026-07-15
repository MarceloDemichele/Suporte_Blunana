"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarSessao = criarSessao;
require("../../config/loadEnv");
const playwright_1 = require("playwright");
async function criarSessao() {
    const headless = process.env.HEADLESS === "true";
    const browser = await playwright_1.chromium.launch({
        headless
    });
    const page = await browser.newPage();
    return { browser, page };
}
