"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../config/loadEnv");
const fs_1 = __importDefault(require("fs"));
const login_1 = require("../../crawler-interface/auth/login");
const userName = process.env.TARGET_USER?.trim() || "";
if (!userName)
    throw new Error("TARGET_USER não informado.");
async function main() {
    const menu = JSON.parse(fs_1.default.readFileSync("outputs/json/blunana/prod/blunana-menu.json", "utf-8"));
    const route = menu.find((item) => item.href?.endsWith("/configuracao_usuario"))?.href;
    if (!route)
        throw new Error("Rota de Configuração Usuário não localizada.");
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        await page.goto(route, { waitUntil: "networkidle" });
        await page.getByPlaceholder(/filtrar por nome ou email/i).first().fill(userName);
        await page.waitForTimeout(1500);
        const row = page.locator("tbody tr").filter({ hasText: userName }).first();
        const actions = await row.locator("button").evaluateAll((buttons) => buttons.map((button, index) => ({
            index,
            title: button.getAttribute("title") || "",
            ariaLabel: button.getAttribute("aria-label") || "",
            dataTestId: button.getAttribute("data-testid") || "",
            classes: button.className,
            iconClasses: Array.from(button.querySelectorAll("svg, i")).map((icon) => icon.getAttribute("class") || ""),
            iconText: Array.from(button.querySelectorAll("i")).map((icon) => (icon.textContent || "").trim())
        })));
        console.log(JSON.stringify({ count: actions.length, actions }, null, 2));
    }
    finally {
        await browser.close();
    }
}
main().catch((error) => {
    console.error(`Inspeção segura falhou: ${String(error)}`);
    process.exit(1);
});
