"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coletarTelas = coletarTelas;
const fs_1 = __importDefault(require("fs"));
const environment_1 = require("../../config/environment");
const paths_1 = require("../../config/paths");
function nomeArquivoSeguro(valor) {
    return valor
        .toLowerCase()
        .replace(/https?:\/\//g, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}
async function coletarTelas(page) {
    const menuPath = (0, paths_1.outputPath)("blunana-menu.json");
    if (!fs_1.default.existsSync(menuPath)) {
        throw new Error(`Arquivo ${menuPath} nao encontrado. Execute primeiro npm run menu:${environment_1.currentEnvironment}`);
    }
    const menus = JSON.parse(fs_1.default.readFileSync(menuPath, "utf-8"));
    const telas = menus
        .filter((item) => item.href)
        .filter((item, index, self) => index === self.findIndex((x) => x.href === item.href));
    (0, paths_1.ensureOutputScreenshotsRoot)();
    const inventario = [];
    for (const tela of telas) {
        try {
            await page.goto(tela.href, { waitUntil: "networkidle" });
            const titulo = await page.title();
            const url = page.url();
            const h1 = await page.locator("h1").first().textContent().catch(() => "");
            const h2 = await page.locator("h2").first().textContent().catch(() => "");
            const nomeBase = nomeArquivoSeguro(tela.texto || tela.href);
            const screenshotPath = (0, paths_1.outputScreenshotsPath)(`${nomeBase}.png`);
            const captureScreenshots = process.env.CAPTURE_SCREENSHOTS === "true";
            if (captureScreenshots) {
                await page.screenshot({
                    path: screenshotPath,
                    fullPage: true,
                });
            }
            inventario.push({
                menu: tela.texto,
                url,
                titulo,
                h1: h1?.trim(),
                h2: h2?.trim(),
                screenshot: captureScreenshots ? screenshotPath : "desabilitado em produção",
            });
            console.log(`Tela coletada: ${tela.texto || tela.href}`);
        }
        catch (error) {
            inventario.push({
                menu: tela.texto,
                url: tela.href,
                erro: String(error),
            });
            console.log(`Erro ao coletar tela: ${tela.texto || tela.href}`);
        }
    }
    fs_1.default.writeFileSync((0, paths_1.outputPath)("blunana-telas.json"), JSON.stringify(inventario, null, 2), "utf-8");
    console.log(`Total de telas coletadas: ${inventario.length}`);
}
