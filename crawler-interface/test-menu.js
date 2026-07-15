"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./auth/login");
const menu_collector_1 = require("./collectors/menu.collector");
async function main() {
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        await (0, menu_collector_1.coletarMenu)(page);
    }
    finally {
        await browser.close();
    }
}
main().catch((error) => {
    console.error("Erro ao coletar menu:", error);
    process.exit(1);
});
