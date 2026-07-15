import { Page } from "playwright";
import fs from "fs";
import { ensureOutputRoot, outputPath } from "../../config/paths";

function sanitizarTexto(texto: string): string {
  return texto
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]")
    .trim();
}

function sanitizarHref(href: string): string {
  if (!href) return "";
  try {
    const url = new URL(href);
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

export async function coletarMenu(page: Page) {
  await page.waitForLoadState("networkidle");

  const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) =>
    elements
      .map((el) => ({
        texto: (el.textContent || "").trim(),
        href: el instanceof HTMLAnchorElement ? el.href : "",
        ariaLabel: el.getAttribute("aria-label") || "",
        title: el.getAttribute("title") || "",
      }))
      .filter((item) => item.texto || item.href || item.ariaLabel || item.title)
  );

  const menusSanitizados = menus.map((item) => ({
    texto: sanitizarTexto(item.texto),
    href: sanitizarHref(item.href),
    ariaLabel: sanitizarTexto(item.ariaLabel),
    title: sanitizarTexto(item.title),
  }));

  ensureOutputRoot();

  fs.writeFileSync(
    outputPath("blunana-menu.json"),
    JSON.stringify(menusSanitizados, null, 2),
    "utf-8"
  );

  console.log(`Menus coletados: ${menusSanitizados.length}`);
}
