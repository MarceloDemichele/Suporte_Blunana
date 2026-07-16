import fs from "fs";
import path from "path";
import { Page } from "playwright";
import { loginBlunana } from "../../crawler-interface/auth/login";

export type DirectedTarget = "user" | "process" | "publication" | "deadline" | "hearing" | "attestation";

export type DirectedQueryPlan = {
  target: DirectedTarget;
  value: string;
  routeLabel: string;
  filterKind: "name" | "process-number";
};

export type DirectedEvidence = {
  kind: "directed-query";
  target: DirectedTarget;
  query: string;
  route: string;
  found: boolean;
  count: number;
  columns: string[];
  rows: string[][];
  details?: Record<string, string | boolean | null>;
  permissions?: Record<string, boolean>;
  source: "playwright-prod" | "playwright-hml";
  readOnly: true;
  capturedAt: string;
  limitations: string[];
};

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeForLog(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
    .replace(/\b(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}-?\d{4}\b/g, "[TELEFONE_REMOVIDO]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]");
}

function extractNamedUser(question: string): string {
  const afterDash = question.match(/\s[-–—]\s*([^?]+)\??\s*$/)?.[1];
  if (afterDash) return clean(afterDash);
  const named = question.match(/(?:usu[aá]ri[oa]|perfil(?: de acesso)? (?:de|da|do))\s*(?:de|da|do)?\s*[:\-]?\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][^?]+)\??$/i)?.[1];
  return clean(named || "");
}

export function planDirectedQuery(question: string): DirectedQueryPlan | null {
  const text = normalize(question);
  const processNumber = question.match(/\b\d{20}\b/)?.[0] || "";

  if (text.includes("perfil de acesso") || text.includes("permissoes da usuaria") || text.includes("permissoes do usuario") || text.includes("acessos da usuaria") || text.includes("acessos do usuario")) {
    const name = extractNamedUser(question);
    return name ? { target: "user", value: name, routeLabel: "Configuração Usuário", filterKind: "name" } : null;
  }

  if (!processNumber) return null;
  if (text.includes("publicacao")) return { target: "publication", value: processNumber, routeLabel: "Publicações", filterKind: "process-number" };
  if (text.includes("audiencia")) return { target: "hearing", value: processNumber, routeLabel: "Audiência", filterKind: "process-number" };
  if (text.includes("ateste")) return { target: "attestation", value: processNumber, routeLabel: "Ateste", filterKind: "process-number" };
  if (text.includes("prazo")) return { target: "deadline", value: processNumber, routeLabel: "Prazos", filterKind: "process-number" };
  if (text.includes("processo")) return { target: "process", value: processNumber, routeLabel: "Processos", filterKind: "process-number" };
  return null;
}

function menuInventoryPath(): string {
  const environment = process.env.APP_ENV || "prod";
  return path.join("outputs", "json", "blunana", environment, "blunana-menu.json");
}

function resolveRoute(label: string): string {
  const inventoryPath = menuInventoryPath();
  if (!fs.existsSync(inventoryPath)) throw new Error(`Inventário de menu não encontrado: ${inventoryPath}`);
  const menu = JSON.parse(fs.readFileSync(inventoryPath, "utf-8")) as Array<{ texto?: string; href?: string }>;
  const expected = normalize(label);
  const item = menu.find((entry) => normalize(entry.texto || "") === expected && entry.href);
  if (!item?.href) throw new Error(`Rota não encontrada para ${label}.`);
  return item.href;
}

async function fillDirectedFilter(page: Page, plan: DirectedQueryPlan): Promise<void> {
  if (plan.filterKind === "name") {
    const field = page.getByPlaceholder(/filtrar por nome ou email/i).first();
    await field.waitFor({ state: "visible", timeout: 15000 });
    await field.fill(plan.value);
  } else {
    const formatted = page.getByPlaceholder("0000000-00.0000.0.00.0000", { exact: true });
    if (await formatted.count()) {
      await formatted.first().fill(plan.value);
    } else {
      const candidate = page.locator('input[type="text"]:not([aria-label*="Items per page"])').filter({ visible: true });
      const count = await candidate.count();
      if (count === 0) throw new Error("Filtro textual não localizado na tela.");
      await candidate.nth(Math.min(1, count - 1)).fill(plan.value);
    }
  }
  await page.waitForTimeout(1500);
}

async function extractTable(page: Page, value: string): Promise<{ columns: string[]; rows: string[][] }> {
  const columns = (await page.locator("thead th").allTextContents()).map(clean).filter(Boolean);
  const allRows = page.locator("tbody tr");
  const matched = allRows.filter({ hasText: value });
  const selected = await matched.count() > 0 ? matched : allRows;
  const limit = Math.min(await selected.count(), 10);
  const rows: string[][] = [];
  for (let index = 0; index < limit; index += 1) {
    const cells = (await selected.nth(index).locator("td").allTextContents()).map(clean);
    if (cells.some(Boolean)) rows.push(cells);
  }
  return { columns, rows };
}

async function selectedClient(page: Page): Promise<string> {
  const select = page.locator("select").first();
  if (!await select.count()) return "";
  return clean(await select.locator("option:checked").textContent().catch(() => "") || "");
}

async function safeOpenUserDetails(page: Page, userName: string): Promise<{
  details?: Record<string, string | boolean | null>;
  permissions?: Record<string, boolean>;
  limitation?: string;
}> {
  const row = page.locator("tbody tr").filter({ hasText: userName }).first();
  if (!await row.count()) return { limitation: "Usuário não localizado na listagem filtrada." };

  const safeButton = row.locator("button").filter({
    has: page.locator('[aria-label*="editar" i], [title*="editar" i], [aria-label*="visualizar" i], [title*="visualizar" i], [aria-label*="detalhe" i], [title*="detalhe" i]')
  }).first();
  const directSafeButton = row.locator('button[aria-label*="editar" i], button[title*="editar" i], button[aria-label*="visualizar" i], button[title*="visualizar" i], button[aria-label*="detalhe" i], button[title*="detalhe" i]').first();
  const whitelistedIconButton = row.locator("button:has(.mdi-pencil)").first();
  const button = await directSafeButton.count() ? directSafeButton : await safeButton.count() ? safeButton : whitelistedIconButton;
  if (!await button.count()) {
    return { limitation: "A ação da linha não possui rótulo seguro; o agente não clicou no ícone." };
  }

  await button.click();
  const dialog = page.locator('[role="dialog"], .v-dialog').filter({ visible: true }).first();
  await dialog.waitFor({ state: "visible", timeout: 10000 });

  const values = await dialog.locator("input, select").evaluateAll((elements) => elements.map((element) => {
    const input = element as HTMLInputElement;
    const select = element as HTMLSelectElement;
    const parentText = (element.parentElement?.parentElement?.innerText || element.parentElement?.innerText || "").trim();
    return {
      tag: element.tagName.toLowerCase(),
      type: input.type || "",
      value: element.tagName.toLowerCase() === "select" ? select.options[select.selectedIndex]?.text || "" : input.value || "",
      checked: input.type === "checkbox" ? input.checked : null,
      context: parentText
    };
  }));

  const checkboxes = values.filter((item) => item.type === "checkbox").slice(-4);
  const permissions: Record<string, boolean> = {};
  const permissionNames = ["Concluir prazo", "Excluir registro", "Alteração", "Visualizar estrutura"];
  checkboxes.slice(0, permissionNames.length).forEach((item, index) => {
    permissions[permissionNames[index]] = Boolean(item.checked);
  });

  const details: Record<string, string | boolean | null> = {};
  for (const item of values) {
    const context = normalize(item.context);
    if (context.includes("papel") && item.value) details.Papel = clean(item.value);
    if (context.includes("nome") && item.value) details.Nome = clean(item.value);
    if (context.includes("email") && item.value) details.Email = clean(item.value);
    if (context.includes("celular") && item.value) details.Celular = clean(item.value);
  }
  const selectedValues = values.filter((item) => item.tag === "select" && item.value).map((item) => clean(item.value));
  if (!details.Cliente && selectedValues[0]) details.Cliente = selectedValues[0];
  if (!details.Papel && selectedValues[1]) details.Papel = selectedValues[1];
  if (!details.Cliente) details.Cliente = await selectedClient(page);

  return { details, permissions };
}

async function executeDirectedQuery(page: Page, plan: DirectedQueryPlan): Promise<DirectedEvidence> {
  const route = resolveRoute(plan.routeLabel);
  await page.goto(route, { waitUntil: "networkidle" });
  if (plan.target === "user") {
    await page.getByRole("button", { name: /^usu[aá]rios$/i }).first().click().catch(() => undefined);
  }
  await fillDirectedFilter(page, plan);
  const table = await extractTable(page, plan.value);
  const limitations: string[] = [];
  let details: Record<string, string | boolean | null> | undefined;
  let permissions: Record<string, boolean> | undefined;

  if (plan.target === "user" && table.rows.length > 0) {
    const detailResult = await safeOpenUserDetails(page, plan.value);
    details = detailResult.details;
    permissions = detailResult.permissions;
    if (detailResult.limitation) limitations.push(detailResult.limitation);
  }

  return {
    kind: "directed-query",
    target: plan.target,
    query: plan.value,
    route,
    found: table.rows.length > 0,
    count: table.rows.length,
    columns: table.columns,
    rows: table.rows,
    details,
    permissions,
    source: (process.env.APP_ENV || "prod") === "prod" ? "playwright-prod" : "playwright-hml",
    readOnly: true,
    capturedAt: new Date().toISOString(),
    limitations
  };
}

function saveSanitizedEvidence(question: string, evidence: DirectedEvidence): string {
  const directory = path.join("outputs", "runtime-evidence");
  fs.mkdirSync(directory, { recursive: true });
  const outputPath = path.join(directory, `directed-${Date.now()}.json`);
  const serialized = sanitizeForLog(JSON.stringify({ question, evidence }, null, 2));
  fs.writeFileSync(outputPath, serialized, "utf-8");
  return outputPath;
}

export async function consultarAplicacao(pergunta: string) {
  if (process.env.ALLOW_PLAYWRIGHT !== "true") {
    return { used: false, evidence: "Playwright desabilitado." };
  }

  const plan = planDirectedQuery(pergunta);
  const { browser, page } = await loginBlunana();

  try {
    if (plan) {
      const evidence = await executeDirectedQuery(page, plan);
      const savedPath = saveSanitizedEvidence(pergunta, evidence);
      return { used: true, evidence, savedPath };
    }

    const title = await page.title();
    const url = page.url();
    const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) =>
      elements.map((el) => ({
        text: (el.textContent || "").trim(),
        href: el instanceof HTMLAnchorElement ? el.href : ""
      })).filter((item) => item.text || item.href).slice(0, 50)
    );
    return { used: true, evidence: { title, url, menus, question: pergunta } };
  } finally {
    await browser.close();
  }
}
