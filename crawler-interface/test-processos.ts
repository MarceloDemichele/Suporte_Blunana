import fs from "fs";
import { loginBlunana } from "./auth/login";
import { ensureOutputRoot, outputPath } from "../config/paths";
import { currentEnvironment } from "../config/environment";

function sanitizar(texto: string): string {
  return texto
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]")
    .trim();
}

async function main() {
  const menuPath = outputPath("blunana-menu.json");
  if (!fs.existsSync(menuPath)) {
    throw new Error(`Menu ${currentEnvironment.toUpperCase()} ausente. Execute npm run menu:${currentEnvironment} primeiro.`);
  }

  const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));
  const processos = menu.find((item: { texto?: string }) => item.texto?.trim().toLowerCase() === "processos");
  if (!processos?.href) throw new Error("Rota PROD do menu Processos nao encontrada.");

  const { browser, page } = await loginBlunana();
  try {
    const loginOrigin = new URL(page.url()).origin;
    const target = new URL(processos.href);
    if (target.origin !== loginOrigin) throw new Error("Rota Processos fora da origem autorizada.");

    await page.goto(target.toString(), { waitUntil: "networkidle" });

    const evidence = await page.evaluate(() => {
      const text = (element: Element) => (element.textContent || "").trim();
      return {
        title: document.title,
        path: window.location.pathname,
        headings: Array.from(document.querySelectorAll("h1, h2, h3")).map(text).filter(Boolean).slice(0, 30),
        labels: Array.from(document.querySelectorAll("label")).map(text).filter(Boolean).slice(0, 80),
        fields: Array.from(document.querySelectorAll("input, select, textarea")).map((field) => ({
          tag: field.tagName.toLowerCase(),
          type: field instanceof HTMLInputElement ? field.type : "",
          name: field.getAttribute("name") || "",
          id: field.id,
          placeholder: field.getAttribute("placeholder") || "",
          ariaLabel: field.getAttribute("aria-label") || "",
          required: field.hasAttribute("required"),
          disabled: field.hasAttribute("disabled")
        })).slice(0, 80),
        buttons: Array.from(document.querySelectorAll("button")).map((button) => ({
          text: text(button),
          ariaLabel: button.getAttribute("aria-label") || "",
          title: button.getAttribute("title") || "",
          type: button.type,
          disabled: button.disabled
        })).filter((button) => button.text || button.ariaLabel || button.title).slice(0, 80),
        tableHeaders: Array.from(document.querySelectorAll("th")).map(text).filter(Boolean).slice(0, 80)
      };
    });

    const sanitized = {
      capturedAt: new Date().toISOString(),
      environment: currentEnvironment,
      mode: "read-only",
      title: sanitizar(evidence.title),
      path: evidence.path,
      headings: evidence.headings.map(sanitizar),
      labels: evidence.labels.map(sanitizar),
      fields: evidence.fields.map((field) => ({
        ...field,
        name: sanitizar(field.name),
        id: sanitizar(field.id),
        placeholder: sanitizar(field.placeholder),
        ariaLabel: sanitizar(field.ariaLabel)
      })),
      buttons: evidence.buttons.map((button) => ({
        ...button,
        text: sanitizar(button.text),
        ariaLabel: sanitizar(button.ariaLabel),
        title: sanitizar(button.title)
      })),
      tableHeaders: evidence.tableHeaders.map(sanitizar)
    };

    ensureOutputRoot();
    fs.writeFileSync(outputPath("processos-tela.json"), JSON.stringify(sanitized, null, 2), "utf-8");
    console.log(`Tela Processos mapeada: ${sanitized.fields.length} campos, ${sanitized.buttons.length} botoes.`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Erro ao mapear Processos:", error);
  process.exit(1);
});
