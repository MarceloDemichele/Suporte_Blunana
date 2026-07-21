"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const login_1 = require("./auth/login");
const paths_1 = require("../config/paths");
const testes = [
    { nome: "Tipo de Ateste", rota: "configuracao_de_ateste", aba: /tipos de ateste/i, abrir: /adicionar ateste/i },
    { nome: "Regra de Ateste", rota: "configuracao_de_ateste", aba: /regras de ateste/i, abrir: /adicionar regra/i },
    { nome: "Usuario", rota: "configuracao_usuario", abrir: /adicionar usu[aá]rio/i },
    { nome: "Configuracao de Publicacao", rota: "configuracao_de_publicacoes", abrir: /adicionar configura/i },
    { nome: "Configuracao do Prazo", rota: "configuracao_de_prazo", abrir: /adicionar configura/i },
    { nome: "Configuracao de Processos", rota: "configuracao_de_processos", abrir: /adicionar configura/i },
    { nome: "Processo", rota: "processos1", abrir: /adicionar processo/i }
];
function sanitizar(texto) {
    return texto.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
        .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
        .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]").trim();
}
async function main() {
    if (process.env.APP_ENV !== "hml")
        throw new Error("Execucao permitida apenas em HML.");
    const menus = JSON.parse(fs_1.default.readFileSync((0, paths_1.outputPath)("blunana-menu.json"), "utf-8"));
    const rota = (fim) => menus.find((item) => item.href && new URL(item.href).pathname.endsWith(`/${fim}`))?.href;
    const { browser, page } = await (0, login_1.loginBlunana)();
    const resultados = [];
    try {
        for (const teste of testes) {
            const href = rota(teste.rota);
            if (!href)
                throw new Error(`Rota ausente: ${teste.rota}`);
            await page.goto(href, { waitUntil: "networkidle", timeout: 45000 });
            if (teste.aba) {
                await page.getByRole("tab", { name: teste.aba }).click();
                await page.waitForTimeout(500);
            }
            await page.getByRole("button", { name: teste.abrir }).first().click();
            const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
            await dialog.waitFor({ state: "visible", timeout: 10000 });
            const salvar = dialog.getByRole("button", { name: /salvar/i }).first();
            const disabled = await salvar.isDisabled().catch(() => false);
            const responses = [];
            const listener = (response) => {
                if (response.request().method() === "POST")
                    responses.push({ path: new URL(response.url()).pathname, status: response.status() });
            };
            page.on("response", listener);
            if (!disabled)
                await salvar.click();
            await page.waitForTimeout(1200);
            page.off("response", listener);
            const permaneceuAberto = await dialog.isVisible().catch(() => false);
            const mensagens = permaneceuAberto ? await dialog.locator('.v-messages__message,[role="alert"],.alert,.error')
                .allTextContents().then((items) => [...new Set(items.map(sanitizar).filter(Boolean))]) : [];
            // O Blunana usa POST também para consultas RPC nomeadas como get_*.
            // Somente chamadas que não sejam explicitamente de leitura acionam o bloqueio de segurança.
            const postSucesso = !disabled && responses.some((response) => response.status >= 200 && response.status < 300 && !/\/call\/get_[^/]+$/i.test(response.path));
            resultados.push({ nome: teste.nome, salvarDesabilitado: disabled, permaneceuAberto, mensagens, posts: responses.map((r) => ({ status: r.status, path: r.path })) });
            console.log(`${teste.nome}: ${disabled ? "SALVAR_DESABILITADO" : permaneceuAberto ? "VALIDACAO_BLOQUEOU" : "MODAL_FECHOU"}`);
            if (!permaneceuAberto || postSucesso)
                throw new Error(`Possivel gravacao detectada em ${teste.nome}; ciclo interrompido.`);
            const cancelar = dialog.getByRole("button", { name: /cancelar|fechar/i }).first();
            if (await cancelar.isVisible().catch(() => false))
                await cancelar.click();
            await page.keyboard.press("Escape");
        }
    }
    finally {
        (0, paths_1.ensureOutputRoot)();
        fs_1.default.writeFileSync((0, paths_1.outputPath)("validacoes-obrigatoriedade.json"), JSON.stringify({ capturedAt: new Date().toISOString(), resultados }, null, 2), "utf-8");
        await browser.close();
    }
    console.log("Validacao de obrigatoriedade concluida sem gravacao.");
}
main().catch((error) => { console.error("Erro na validacao de obrigatoriedade:", error); process.exit(1); });
