"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const login_1 = require("./auth/login");
const paths_1 = require("../config/paths");
const rotasConfiguracao = new Set([
    "configuracao_de_ateste", "configuracao_usuario", "configuracao_de_publicacoes",
    "configuracao_de_prazo", "configuracao_de_processos"
]);
const rotasMenu = new Set([
    "home", "agenda_nova", "processos1", "publicacoes", "novos_prazos",
    "audiencia", "audiencia_multirao", "ateste"
]);
const rotas = process.env.DEEP_GROUP === "menu" ? rotasMenu : rotasConfiguracao;
const globais = /hide menu|change language|change theme|enter fullscreen|open user data|first page|previous page|next page|last page/i;
function limpar(texto) {
    return texto.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
        .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
        .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]").trim();
}
function slug(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
async function estrutura(page, selector = "body") {
    const root = page.locator(selector).filter({ visible: true }).first();
    const data = await root.evaluate((element) => {
        const text = (el) => (el.textContent || "").trim();
        return {
            labels: Array.from(element.querySelectorAll("label")).map(text).filter(Boolean),
            fields: Array.from(element.querySelectorAll("input,select,textarea")).map((field) => ({
                tag: field.tagName.toLowerCase(), type: field instanceof HTMLInputElement ? field.type : "",
                name: field.getAttribute("name") || "", placeholder: field.getAttribute("placeholder") || "",
                ariaLabel: field.getAttribute("aria-label") || "", disabled: field.hasAttribute("disabled")
            })),
            buttons: Array.from(element.querySelectorAll("button")).map((button) => ({
                text: text(button), ariaLabel: button.getAttribute("aria-label") || "",
                title: button.getAttribute("title") || "", disabled: button.disabled
            })).filter((button) => button.text || button.ariaLabel || button.title),
            columns: Array.from(element.querySelectorAll("th")).map(text).filter(Boolean),
            messages: Array.from(element.querySelectorAll('.v-messages__message,[role="alert"],.alert,.error'))
                .map(text).filter(Boolean)
        };
    });
    return {
        labels: [...new Set(data.labels.map(limpar))],
        fields: data.fields.map((f) => ({ ...f, name: limpar(f.name), placeholder: limpar(f.placeholder), ariaLabel: limpar(f.ariaLabel) })),
        buttons: data.buttons.map((b) => ({ ...b, text: limpar(b.text), ariaLabel: limpar(b.ariaLabel), title: limpar(b.title) }))
            .filter((b) => !globais.test(`${b.text} ${b.ariaLabel} ${b.title}`)),
        columns: [...new Set(data.columns.map(limpar))], messages: [...new Set(data.messages.map(limpar))]
    };
}
function lista(items) { return items.length ? items.map((x) => `- ${x}`).join("\n") : "- Nao identificado."; }
async function main() {
    if (process.env.APP_ENV !== "hml")
        throw new Error("Execucao permitida apenas em HML.");
    const menus = JSON.parse(fs_1.default.readFileSync((0, paths_1.outputPath)("blunana-menu.json"), "utf-8"));
    const alvos = menus.filter((m) => m.href && rotas.has(new URL(m.href).pathname.split("/").pop() || ""));
    const { browser, page } = await (0, login_1.loginBlunana)();
    const docsDir = path_1.default.join("docs", "telas", "hml");
    (0, paths_1.ensureOutputRoot)();
    try {
        for (const alvo of alvos) {
            await page.goto(alvo.href, { waitUntil: "networkidle", timeout: 45000 });
            const abas = await page.getByRole("tab").allTextContents();
            const secoes = [];
            const nomesAbas = abas.map(limpar).filter(Boolean);
            if (nomesAbas.length) {
                for (const nome of nomesAbas) {
                    const abriuAba = await page.getByRole("tab", { name: nome, exact: true })
                        .click({ timeout: 8000 }).then(() => true).catch(() => false);
                    if (!abriuAba) {
                        console.log(`Aba bloqueada, seguindo: ${alvo.texto} / ${nome}`);
                        continue;
                    }
                    await page.waitForTimeout(500);
                    secoes.push({ aba: nome, estrutura: await estrutura(page) });
                }
            }
            else {
                secoes.push({ aba: "Tela principal", estrutura: await estrutura(page) });
            }
            const modais = [];
            for (const secao of secoes) {
                await page.keyboard.press("Escape");
                await page.waitForTimeout(300);
                if (secao.aba !== "Tela principal") {
                    const reabriu = await page.getByRole("tab", { name: secao.aba, exact: true })
                        .click({ timeout: 8000 }).then(() => true).catch(() => false);
                    if (!reabriu)
                        continue;
                    await page.waitForTimeout(300);
                }
                const abrir = page.getByRole("button", { name: /adicionar|novo|cadastrar|incluir/i }).first();
                if (!await abrir.isVisible().catch(() => false))
                    continue;
                const origem = limpar(await abrir.innerText());
                if (!await abrir.click({ timeout: 5000 }).then(() => true).catch(() => false)) {
                    console.log(`Modal bloqueado, seguindo: ${alvo.texto} / ${secao.aba}`);
                    continue;
                }
                const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
                if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
                    modais.push({ origem, estrutura: await estrutura(page, '[role="dialog"],.v-dialog') });
                    const cancelar = dialog.getByRole("button", { name: /cancelar|fechar/i }).first();
                    if (await cancelar.isVisible().catch(() => false))
                        await cancelar.click();
                    await page.keyboard.press("Escape");
                    await dialog.waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
                    await page.waitForTimeout(300);
                }
            }
            const result = { capturedAt: new Date().toISOString(), environment: "hml", menu: alvo.texto, path: new URL(alvo.href).pathname, secoes, modais };
            const name = slug(alvo.texto);
            fs_1.default.writeFileSync((0, paths_1.outputPath)(`${name}-detalhado.json`), JSON.stringify(result, null, 2), "utf-8");
            let md = `# Memoria funcional aprofundada - ${alvo.texto}\n\nAmbiente: HML\n\nRota: \`${result.path}\`\n\n`;
            for (const secao of secoes) {
                const botoes = secao.estrutura.buttons.map((b) => b.text || b.ariaLabel || b.title).filter(Boolean);
                md += `## ${secao.aba}\n\n### Filtros e campos\n\n${lista(secao.estrutura.labels)}\n\n### Botoes funcionais\n\n${lista(botoes)}\n\n### Colunas\n\n${lista(secao.estrutura.columns)}\n\n`;
            }
            for (const modal of modais) {
                const botoes = modal.estrutura.buttons.map((b) => b.text || b.ariaLabel || b.title).filter(Boolean);
                md += `## Modal - ${modal.origem}\n\n### Campos\n\n${lista(modal.estrutura.labels)}\n\n### Botoes\n\n${lista(botoes)}\n\n`;
            }
            md += `## Regras de seguranca da coleta\n\n- Nenhum valor de tabela foi coletado.\n- Nenhum formulario foi submetido.\n- Nenhuma alteracao foi confirmada.\n- Nenhuma screenshot foi capturada.\n`;
            fs_1.default.writeFileSync(path_1.default.join(docsDir, `${name}.md`), md, "utf-8");
            console.log(`Aprofundada: ${alvo.texto} (${secoes.length} secoes, ${modais.length} modais)`);
        }
    }
    finally {
        await browser.close();
    }
}
main().catch((error) => { console.error("Erro ao aprofundar telas:", error); process.exit(1); });
