"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../config/paths");
const login_1 = require("./auth/login");
const menu_collector_1 = require("./collectors/menu.collector");
const screens_collector_1 = require("./collectors/screens.collector");
const requiredEnvironment = "prod";
function criarEstruturaBlunanaProd() {
    const pastas = [
        (0, paths_1.outputReportsPath)("00-inventario"),
        (0, paths_1.outputReportsPath)("01-mapa-navegacao"),
        (0, paths_1.outputReportsPath)("02-telas"),
        (0, paths_1.outputReportsPath)("03-regras-negocio"),
        (0, paths_1.outputReportsPath)("04-fluxos"),
        (0, paths_1.outputReportsPath)("05-campos-validacoes"),
        (0, paths_1.outputReportsPath)("06-permissoes"),
        (0, paths_1.outputReportsPath)("07-integracoes"),
        (0, paths_1.outputReportsPath)("08-erros-mensagens"),
        (0, paths_1.outputReportsPath)("09-faq-cliente"),
        (0, paths_1.outputReportsPath)("10-chamados-sugeridos"),
        (0, paths_1.outputReportsPath)("11-evidencias-sanitizadas"),
    ];
    (0, paths_1.ensureOutputLogsRoot)();
    (0, paths_1.ensureOutputReportsRoot)();
    (0, paths_1.ensureOutputScreenshotsRoot)();
    for (const pasta of pastas) {
        fs_1.default.mkdirSync(pasta, { recursive: true });
    }
    fs_1.default.writeFileSync((0, paths_1.outputReportsPath)("README.md"), `# Engenharia Reversa Blunana PROD

Documentacao e evidencias geradas a partir de navegacao controlada em producao.

## Organizacao

- Dominio: Blunana
- Ambiente: PROD
- JSON: \`${paths_1.outputJsonRoot.replace(/\\/g, "/")}\`
- Relatorios: \`${paths_1.outputReportsRoot.replace(/\\/g, "/")}\`

## Regra

Todo arquivo novo desta execucao deve permanecer dentro das pastas tipadas de \`outputs/\`.
`, "utf-8");
}
function escreverLog(status, detalhe) {
    fs_1.default.writeFileSync((0, paths_1.outputLogsPath)("engenharia-reversa-blunana-prod-log.md"), `# Log Engenharia Reversa Blunana PROD

Status: ${status}

Pasta JSON:
- ${paths_1.outputJsonRoot.replace(/\\/g, "/")}

Arquivos base esperados:
- ${(0, paths_1.outputPath)("blunana-menu.json").replace(/\\/g, "/")}
- ${(0, paths_1.outputPath)("blunana-telas.json").replace(/\\/g, "/")}

${detalhe ? `Detalhe:\n- ${detalhe}\n` : ""}
`, "utf-8");
}
async function main() {
    if (process.env.APP_ENV !== requiredEnvironment) {
        throw new Error("Este script deve ser executado apenas com APP_ENV=prod.");
    }
    criarEstruturaBlunanaProd();
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        await (0, menu_collector_1.coletarMenu)(page);
        await (0, screens_collector_1.coletarTelas)(page);
        escreverLog("executado");
    }
    catch (error) {
        escreverLog("falha", error instanceof Error ? error.message : String(error));
        throw error;
    }
    finally {
        await browser.close();
    }
}
main().catch((error) => {
    console.error("Erro na engenharia reversa Blunana prod:", error);
    process.exit(1);
});
