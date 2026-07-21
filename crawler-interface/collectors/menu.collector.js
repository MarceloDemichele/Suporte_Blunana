"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coletarMenu = coletarMenu;
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../../config/paths");
function sanitizarTexto(texto) {
    return texto
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
        .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
        .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]")
        .trim();
}
function sanitizarHref(href) {
    if (!href)
        return "";
    try {
        const url = new URL(href);
        url.username = "";
        url.password = "";
        url.search = "";
        url.hash = "";
        return url.toString();
    }
    catch {
        return "";
    }
}
async function coletarMenu(page) {
    await page.waitForLoadState("networkidle");
    const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) => elements
        .map((el) => ({
        texto: (el.textContent || "").trim(),
        href: el instanceof HTMLAnchorElement ? el.href : "",
        ariaLabel: el.getAttribute("aria-label") || "",
        title: el.getAttribute("title") || "",
    }))
        .filter((item) => item.texto || item.href || item.ariaLabel || item.title));
    const menusSanitizados = menus.map((item) => ({
        texto: sanitizarTexto(item.texto),
        href: sanitizarHref(item.href),
        ariaLabel: sanitizarTexto(item.ariaLabel),
        title: sanitizarTexto(item.title),
    }));
    (0, paths_1.ensureOutputRoot)();
    fs_1.default.writeFileSync((0, paths_1.outputPath)("blunana-menu.json"), JSON.stringify(menusSanitizados, null, 2), "utf-8");
    console.log(`Menus coletados: ${menusSanitizados.length}`);
}
