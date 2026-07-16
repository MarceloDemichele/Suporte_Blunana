"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const login_1 = require("./auth/login");
const paths_1 = require("../config/paths");
const numeroProcesso = process.env.TEST_PROCESS_NUMBER?.replace(/\D/g, "") || "";
if (!/^\d{20}$/.test(numeroProcesso)) {
    throw new Error("TEST_PROCESS_NUMBER deve conter os 20 dígitos do processo.");
}
async function main() {
    const menuPath = (0, paths_1.outputPath)("blunana-menu.json");
    const menu = JSON.parse(fs_1.default.readFileSync(menuPath, "utf-8"));
    const processos = menu.find((item) => item.texto?.trim().toLowerCase() === "processos");
    if (!processos?.href)
        throw new Error("Rota de Processos não encontrada no inventário PROD.");
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        await page.goto(processos.href, { waitUntil: "networkidle" });
        const filtro = page.getByPlaceholder("0000000-00.0000.0.00.0000", { exact: true });
        await filtro.fill(numeroProcesso);
        await page.waitForTimeout(1500);
        const linhas = page.locator("tbody tr").filter({ hasText: numeroProcesso });
        const quantidade = await linhas.count();
        const codigos = [];
        for (let indice = 0; indice < quantidade; indice += 1) {
            const linha = linhas.nth(indice);
            const botao = linha.locator("button").last();
            const novaPaginaPromise = page.context().waitForEvent("page");
            await botao.click();
            const detalhe = await novaPaginaPromise;
            await detalhe.waitForLoadState("networkidle");
            const codigo = await detalhe.evaluate(() => {
                const textoPagina = document.body.innerText || "";
                const correspondencia = textoPagina.match(/C[oó]digo do Cliente\s*\n\s*([^\n]+)/i);
                if (correspondencia?.[1])
                    return correspondencia[1].trim();
                const elementos = Array.from(document.querySelectorAll("*"));
                const rotulo = elementos.find((elemento) => elemento.children.length === 0 && elemento.textContent?.trim() === "Código do Cliente");
                if (!rotulo)
                    return "";
                let atual = rotulo.parentElement;
                for (let nivel = 0; atual && nivel < 5; nivel += 1, atual = atual.parentElement) {
                    const linhasTexto = (atual.textContent || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
                    const posicao = linhasTexto.indexOf("Código do Cliente");
                    if (posicao >= 0 && linhasTexto[posicao + 1])
                        return linhasTexto[posicao + 1];
                }
                return "";
            });
            codigos.push(codigo || "NÃO IDENTIFICADO");
            await detalhe.close();
        }
        console.log(JSON.stringify({ numeroProcesso, ocorrencias: quantidade, codigosCliente: codigos }, null, 2));
    }
    finally {
        await browser.close();
    }
}
main().catch((error) => {
    console.error("Falha ao verificar códigos de cliente:", String(error));
    process.exit(1);
});
