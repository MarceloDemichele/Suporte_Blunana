import fs from "fs";
import { Page } from "playwright";
import { loginBlunana } from "./auth/login";
import { outputPath } from "../config/paths";

function exigir(nome: string) {
  const valor = process.env[nome]?.trim();
  if (!valor) throw new Error(`${nome} precisa estar configurado com o texto exibido na tela.`);
  return valor;
}

async function selecionar(page: Page, index: number, value: string) {
  const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
  const select = dialog.locator("select").nth(index);
  await select.selectOption({ label: value });
  await page.waitForTimeout(700);
}

async function opcoes(page: Page, index: number) {
  const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
  return dialog.locator("select").nth(index).locator("option").evaluateAll((items) =>
    items.map((item) => (item.textContent || "").trim()).filter(Boolean)
  );
}

async function opcoesVisuais(page: Page, placeholder: RegExp) {
  const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
  const input = dialog.getByPlaceholder(placeholder);
  await input.locator("xpath=..").click();
  await page.waitForTimeout(500);
  return page.locator('.v-overlay-container .v-list-item-title').filter({ visible: true })
    .allTextContents().then((items) => [...new Set(items.map((item) => item.trim()).filter(Boolean))]);
}

async function main() {
  if (process.env.APP_ENV !== "hml") throw new Error("Execucao permitida apenas em HML.");
  const menu = JSON.parse(fs.readFileSync(outputPath("blunana-menu.json"), "utf-8")) as Array<{ href: string }>;
  const rota = (fim: string) => menu.find((item) => item.href && new URL(item.href).pathname.endsWith(`/${fim}`))?.href;
  const { browser, page } = await loginBlunana();
  try {
    const usuario = rota("configuracao_usuario");
    if (!usuario) throw new Error("Rota Configuracao Usuario nao encontrada.");
    await page.goto(usuario, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /adicionar usu[aá]rio/i }).click();
    console.log("HML_TEST_USER_ROLE - opcoes exibidas:");
    for (const item of await opcoesVisuais(page, /selecione um papel/i)) console.log(`- ${item}`);
    await page.keyboard.press("Escape");

    const prazo = rota("configuracao_de_prazo");
    if (!prazo) throw new Error("Rota Configuracao do Prazo nao encontrada.");
    await page.goto(prazo, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /adicionar configura/i }).click();
    console.log("HML_TEST_DEADLINE_TYPE - opcoes exibidas:");
    for (const item of await opcoesVisuais(page, /selecione o tipo de prazo/i)) console.log(`- ${item}`);
    await page.keyboard.press("Escape");

  } finally { await browser.close(); }
}

main().catch((error) => { console.error("Erro ao listar opcoes HML:", error); process.exit(1); });
