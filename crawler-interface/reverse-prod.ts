import fs from "fs";
import {
  ensureOutputLogsRoot,
  ensureOutputReportsRoot,
  ensureOutputScreenshotsRoot,
  outputJsonRoot,
  outputLogsPath,
  outputReportsPath,
  outputReportsRoot,
  outputPath,
} from "../config/paths";
import { loginBlunana } from "./auth/login";
import { coletarMenu } from "./collectors/menu.collector";
import { coletarTelas } from "./collectors/screens.collector";

const requiredEnvironment = "prod";

function criarEstruturaBlunanaProd() {
  const pastas = [
    outputReportsPath("00-inventario"),
    outputReportsPath("01-mapa-navegacao"),
    outputReportsPath("02-telas"),
    outputReportsPath("03-regras-negocio"),
    outputReportsPath("04-fluxos"),
    outputReportsPath("05-campos-validacoes"),
    outputReportsPath("06-permissoes"),
    outputReportsPath("07-integracoes"),
    outputReportsPath("08-erros-mensagens"),
    outputReportsPath("09-faq-cliente"),
    outputReportsPath("10-chamados-sugeridos"),
    outputReportsPath("11-evidencias-sanitizadas"),
  ];

  ensureOutputLogsRoot();
  ensureOutputReportsRoot();
  ensureOutputScreenshotsRoot();

  for (const pasta of pastas) {
    fs.mkdirSync(pasta, { recursive: true });
  }

  fs.writeFileSync(
    outputReportsPath("README.md"),
    `# Engenharia Reversa Blunana PROD

Documentacao e evidencias geradas a partir de navegacao controlada em producao.

## Organizacao

- Dominio: Blunana
- Ambiente: PROD
- JSON: \`${outputJsonRoot.replace(/\\/g, "/")}\`
- Relatorios: \`${outputReportsRoot.replace(/\\/g, "/")}\`

## Regra

Todo arquivo novo desta execucao deve permanecer dentro das pastas tipadas de \`outputs/\`.
`,
    "utf-8"
  );
}

function escreverLog(status: "executado" | "falha", detalhe?: string) {
  fs.writeFileSync(
    outputLogsPath("engenharia-reversa-blunana-prod-log.md"),
    `# Log Engenharia Reversa Blunana PROD

Status: ${status}

Pasta JSON:
- ${outputJsonRoot.replace(/\\/g, "/")}

Arquivos base esperados:
- ${outputPath("blunana-menu.json").replace(/\\/g, "/")}
- ${outputPath("blunana-telas.json").replace(/\\/g, "/")}

${detalhe ? `Detalhe:\n- ${detalhe}\n` : ""}
`,
    "utf-8"
  );
}

async function main() {
  if (process.env.APP_ENV !== requiredEnvironment) {
    throw new Error("Este script deve ser executado apenas com APP_ENV=prod.");
  }

  criarEstruturaBlunanaProd();

  const { browser, page } = await loginBlunana();

  try {
    await coletarMenu(page);
    await coletarTelas(page);
    escreverLog("executado");
  } catch (error) {
    escreverLog("falha", error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Erro na engenharia reversa Blunana prod:", error);
  process.exit(1);
});
