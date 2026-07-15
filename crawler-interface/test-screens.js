"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./auth/login");
const menu_collector_1 = require("./collectors/menu.collector");
const screens_collector_1 = require("./collectors/screens.collector");
async function main() {
    const { browser, page } = await (0, login_1.loginBlunana)();
    await (0, menu_collector_1.coletarMenu)(page);
    await (0, screens_collector_1.coletarTelas)(page);
    await browser.close();
}
main().catch((error) => {
    console.error("Erro ao coletar telas:", error);
    process.exit(1);
});
