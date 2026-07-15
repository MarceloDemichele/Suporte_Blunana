"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarAplicacao = consultarAplicacao;
const login_1 = require("../../crawler-interface/auth/login");
async function consultarAplicacao(pergunta) {
    if (process.env.ALLOW_PLAYWRIGHT !== "true") {
        return {
            used: false,
            evidence: "Playwright desabilitado.",
        };
    }
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        const title = await page.title();
        const url = page.url();
        const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) => elements
            .map((el) => ({
            text: (el.textContent || "").trim(),
            href: el instanceof HTMLAnchorElement ? el.href : "",
        }))
            .filter((item) => item.text || item.href)
            .slice(0, 50));
        return {
            used: true,
            evidence: {
                title,
                url,
                menus,
                question: pergunta,
            },
        };
    }
    finally {
        await browser.close();
    }
}
