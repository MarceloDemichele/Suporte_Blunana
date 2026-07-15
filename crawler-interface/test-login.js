"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./auth/login");
async function main() {
    const { browser, page } = await (0, login_1.loginBlunana)();
    console.log("Login executado.");
    console.log("URL atual:", page.url());
    await browser.close();
}
main().catch((error) => {
    console.error("Erro no teste de login:", error);
    process.exit(1);
});
