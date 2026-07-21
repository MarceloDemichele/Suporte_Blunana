import fs from "fs";
import path from "path";
import { loginBlunana } from "./auth/login";
import { ensureOutputRoot, outputPath } from "../config/paths";

const rotasPermitidas = new Set([
  "configuracao_de_ateste", "configuracao_usuario", "configuracao_de_publicacoes",
  "configuracao_de_prazo", "configuracao_de_processos", "home", "agenda_nova",
  "processos1", "publicacoes", "novos_prazos", "audiencia", "audiencia_multirao", "ateste"
]);

function sanitizar(texto: string): string {
  return texto.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]").trim();
}

function slug(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function extrair(page: import("playwright").Page) {
  return page.evaluate(() => {
    const text = (el: Element) => (el.textContent || "").trim();
    return {
      title: document.title,
      path: location.pathname,
      headings: Array.from(document.querySelectorAll("h1,h2,h3")).map(text).filter(Boolean).slice(0, 50),
      labels: Array.from(document.querySelectorAll("label")).map(text).filter(Boolean).slice(0, 120),
      fields: Array.from(document.querySelectorAll("input,select,textarea")).map((field) => ({
        tag: field.tagName.toLowerCase(), type: field instanceof HTMLInputElement ? field.type : "",
        name: field.getAttribute("name") || "", placeholder: field.getAttribute("placeholder") || "",
        ariaLabel: field.getAttribute("aria-label") || "", required: field.hasAttribute("required"),
        disabled: field.hasAttribute("disabled")
      })).slice(0, 120),
      buttons: Array.from(document.querySelectorAll("button")).map((button) => ({
        text: text(button), ariaLabel: button.getAttribute("aria-label") || "",
        title: button.getAttribute("title") || "", disabled: button.disabled
      })).filter((b) => b.text || b.ariaLabel || b.title).slice(0, 120),
      tabs: Array.from(document.querySelectorAll('[role="tab"]')).map(text).filter(Boolean).slice(0, 50),
      tableHeaders: Array.from(document.querySelectorAll("th")).map(text).filter(Boolean).slice(0, 120)
    };
  });
}

function limpar(e: Awaited<ReturnType<typeof extrair>>) {
  return {
    ...e, title: sanitizar(e.title), headings: e.headings.map(sanitizar), labels: e.labels.map(sanitizar),
    fields: e.fields.map((f) => ({ ...f, name: sanitizar(f.name), placeholder: sanitizar(f.placeholder), ariaLabel: sanitizar(f.ariaLabel) })),
    buttons: e.buttons.map((b) => ({ ...b, text: sanitizar(b.text), ariaLabel: sanitizar(b.ariaLabel), title: sanitizar(b.title) })),
    tabs: e.tabs.map(sanitizar), tableHeaders: e.tableHeaders.map(sanitizar)
  };
}

function markdown(nome: string, evidence: ReturnType<typeof limpar>, modal: ReturnType<typeof limpar> | null) {
  const lista = (items: string[]) => items.length ? items.map((x) => `- ${x}`).join("\n") : "- Nao identificado.";
  const buttons = evidence.buttons.map((b) => b.text || b.ariaLabel || b.title).filter(Boolean);
  return `# Memoria funcional - ${nome}\n\n` +
    `Ambiente de exploracao: HML\n\nRota: \`${evidence.path}\`\n\n` +
    `## Titulos e secoes\n\n${lista(evidence.headings)}\n\n` +
    `## Rotulos de campos\n\n${lista(evidence.labels)}\n\n` +
    `## Botoes e acoes aparentes\n\n${lista(buttons)}\n\n` +
    `## Abas\n\n${lista(evidence.tabs)}\n\n` +
    `## Colunas de listagem\n\n${lista(evidence.tableHeaders)}\n\n` +
    `## Modal nao destrutivo\n\n${modal ? `Modal aberto e fechado sem submissao.\n\n### Rotulos\n\n${lista(modal.labels)}\n\n### Botoes\n\n${lista(modal.buttons.map((b) => b.text || b.ariaLabel || b.title).filter(Boolean))}` : "Nenhum modal seguro identificado ou aberto."}\n\n` +
    `## Seguranca\n\n- Nenhum valor de campo foi coletado.\n- Nenhuma alteracao foi confirmada.\n- Nenhuma screenshot foi capturada.\n\n` +
    `## Status\n\nMapeamento estrutural inicial. Regras funcionais ainda dependem de validacao do suporte e confirmacao final em PROD.\n`;
}

async function main() {
  if ((process.env.APP_ENV || "") !== "hml") throw new Error("Este mapeamento e exclusivo de HML.");
  const menuPath = outputPath("blunana-menu.json");
  if (!fs.existsSync(menuPath)) throw new Error("Execute npm run menu:hml primeiro.");
  const menus = JSON.parse(fs.readFileSync(menuPath, "utf-8")) as Array<{ texto: string; href: string }>;
  const alvos = menus.filter((item) => item.href && rotasPermitidas.has(new URL(item.href).pathname.split("/").pop() || ""));
  const { browser, page } = await loginBlunana();
  const summary: Array<{ menu: string; status: string; fields?: number; error?: string }> = [];
  const docsDir = path.join("docs", "telas", "hml");
  fs.mkdirSync(docsDir, { recursive: true });
  ensureOutputRoot();

  try {
    for (const alvo of alvos) {
      try {
        await page.goto(alvo.href, { waitUntil: "networkidle", timeout: 45000 });
        const base = limpar(await extrair(page));
        let modal: ReturnType<typeof limpar> | null = null;
        const abrir = page.getByRole("button", { name: /adicionar|novo|cadastrar|incluir/i }).first();
        if (await abrir.isVisible().catch(() => false)) {
          await abrir.click();
          const dialog = page.locator('[role="dialog"], .v-dialog').filter({ visible: true }).first();
          if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) modal = limpar(await extrair(page));
          await page.keyboard.press("Escape");
        }
        const safeName = slug(alvo.texto || new URL(alvo.href).pathname.split("/").pop() || "tela");
        fs.writeFileSync(outputPath(`${safeName}-tela.json`), JSON.stringify({ capturedAt: new Date().toISOString(), environment: "hml", mode: "read-only", menu: alvo.texto, ...base, modal }, null, 2), "utf-8");
        fs.writeFileSync(path.join(docsDir, `${safeName}.md`), markdown(alvo.texto, base, modal), "utf-8");
        summary.push({ menu: alvo.texto, status: "ok", fields: base.fields.length });
        console.log(`Mapeada: ${alvo.texto}`);
      } catch (error) {
        summary.push({ menu: alvo.texto, status: "erro", error: String(error) });
        console.log(`Falha controlada: ${alvo.texto}`);
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(outputPath("mapeamento-escopo-hml.json"), JSON.stringify(summary, null, 2), "utf-8");
  console.log(`Mapeamento concluido: ${summary.filter((x) => x.status === "ok").length}/${alvos.length} telas.`);
}

main().catch((error) => { console.error("Erro no mapeamento HML:", error); process.exit(1); });
