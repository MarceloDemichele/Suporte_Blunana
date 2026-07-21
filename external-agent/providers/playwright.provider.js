"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planDirectedQuery = planDirectedQuery;
exports.consultarAplicacao = consultarAplicacao;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const login_1 = require("../../crawler-interface/auth/login");
function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}
function clean(value) {
    return value.replace(/\s+/g, " ").trim();
}
function sanitizeForLog(value) {
    return value
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
        .replace(/\b(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}-?\d{4}\b/g, "[TELEFONE_REMOVIDO]")
        .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]");
}
function extractNamedUser(question) {
    const afterDash = question.match(/\s[-–—]\s*([^?]+)\??\s*$/)?.[1];
    if (afterDash)
        return clean(afterDash);
    const afterAccessTerm = question.match(/(?:permiss[^\s]*|acessos?|perfil(?:\s+de\s+acesso)?|usu[^\s]*)\s+(?:de|da|do)?\s*[:\-]?\s*([^?]+)\??$/i)?.[1];
    if (afterAccessTerm)
        return clean(afterAccessTerm);
    const named = question.match(/(?:usu[aá]ri[oa]|perfil(?: de acesso)? (?:de|da|do))\s*(?:de|da|do)?\s*[:\-]?\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][^?]+)\??$/i)?.[1];
    return clean(named || "");
}
function planDirectedQuery(question, interpretation) {
    const text = normalize(question);
    const processNumber = interpretation?.identifiers.processNumber || question.match(/\b\d{20}\b/)?.[0] || "";
    const clientCode = interpretation?.identifiers.clientCode || interpretation?.filters.find((filter) => filter.field === "CLIENT_CODE")?.value || question.match(/\b\d{2}\.\d{3}\.\d{4,6}\/\d{4}\b/)?.[0] || "";
    if (clientCode && (interpretation?.entity === "PUBLICATION" || text.includes("publicacao"))) {
        return { target: "publication", value: clientCode, routeLabel: "Publicações", filterKind: "client-code" };
    }
    if (clientCode && (interpretation?.entity === "PROCESS" || text.includes("processo"))) {
        return { target: "process", value: clientCode, routeLabel: "Processos", filterKind: "client-code" };
    }
    const userAccessIntent = ["perfil de acesso", "perfil da usuaria", "perfil do usuario", "permissoes", "acessos", "nivel de acesso", "pode acessar", "tem acesso"].some((term) => text.includes(term)) ||
        (text.includes("perfil") && (text.includes("usuario") || text.includes("usuaria")));
    if (userAccessIntent) {
        const name = interpretation?.identifiers.userName || extractNamedUser(question);
        return name ? { target: "user", value: name, routeLabel: "Configuração Usuário", filterKind: "name" } : null;
    }
    if (!processNumber)
        return null;
    if (text.includes("publicacao"))
        return { target: "publication", value: processNumber, routeLabel: "Publicações", filterKind: "process-number" };
    if (text.includes("audiencia"))
        return { target: "hearing", value: processNumber, routeLabel: "Audiência", filterKind: "process-number" };
    if (text.includes("ateste"))
        return { target: "attestation", value: processNumber, routeLabel: "Ateste", filterKind: "process-number" };
    if (text.includes("prazo"))
        return { target: "deadline", value: processNumber, routeLabel: "Prazos", filterKind: "process-number" };
    if (text.includes("processo"))
        return { target: "process", value: processNumber, routeLabel: "Processos", filterKind: "process-number" };
    return null;
}
function menuInventoryPath() {
    const environment = process.env.APP_ENV || "prod";
    return path_1.default.join("outputs", "json", "blunana", environment, "blunana-menu.json");
}
function resolveRoute(label) {
    const inventoryPath = menuInventoryPath();
    if (!fs_1.default.existsSync(inventoryPath))
        throw new Error(`Inventário de menu não encontrado: ${inventoryPath}`);
    const menu = JSON.parse(fs_1.default.readFileSync(inventoryPath, "utf-8"));
    const expected = normalize(label);
    const item = menu.find((entry) => normalize(entry.texto || "") === expected && entry.href);
    if (!item?.href)
        throw new Error(`Rota não encontrada para ${label}.`);
    return item.href;
}
async function fillDirectedFilter(page, plan) {
    if (plan.filterKind === "name") {
        const field = page.getByPlaceholder(/filtrar por nome ou email/i).first();
        await field.waitFor({ state: "visible", timeout: 15000 });
        await field.fill(plan.value);
    }
    else if (plan.filterKind === "client-code") {
        await page.getByRole("button", { name: /limpar filtros/i }).first().click().catch(() => undefined);
        const field = page.getByPlaceholder(/codigo do cliente/i).first();
        await field.waitFor({ state: "visible", timeout: 15000 });
        await field.fill(plan.value);
    }
    else {
        const formatted = page.getByPlaceholder("0000000-00.0000.0.00.0000", { exact: true });
        if (await formatted.count()) {
            await formatted.first().fill(plan.value);
        }
        else {
            const candidate = page.locator('input[type="text"]:not([aria-label*="Items per page"])').filter({ visible: true });
            const count = await candidate.count();
            if (count === 0)
                throw new Error("Filtro textual não localizado na tela.");
            await candidate.nth(Math.min(1, count - 1)).fill(plan.value);
        }
    }
    await page.waitForTimeout(1500);
}
async function extractTable(page, value) {
    const columns = (await page.locator("thead th").allTextContents()).map(clean).filter(Boolean);
    const allRows = page.locator("tbody tr");
    const matched = allRows.filter({ hasText: value });
    const selected = await matched.count() > 0 ? matched : allRows;
    const limit = Math.min(await selected.count(), 10);
    const rows = [];
    for (let index = 0; index < limit; index += 1) {
        const cells = (await selected.nth(index).locator("td").allTextContents()).map(clean);
        const rowText = normalize(cells.join(" "));
        const emptyState = /\bnenhum(?:a)?\b.*\bencontrad[oa]s?\b|\bnao (?:ha|existem?|foram localizados?)\b/.test(rowText);
        if (cells.some(Boolean) && !emptyState)
            rows.push(cells);
    }
    return { columns, rows };
}
async function selectedClient(page) {
    const select = page.locator("select").first();
    if (!await select.count())
        return "";
    return clean(await select.locator("option:checked").textContent().catch(() => "") || "");
}
async function safeOpenUserDetails(page, userName) {
    const row = page.locator("tbody tr").filter({ hasText: userName }).first();
    if (!await row.count())
        return { limitation: "Usuário não localizado na listagem filtrada." };
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
        const input = element;
        const select = element;
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
    const permissions = {};
    const permissionNames = ["Concluir prazo", "Excluir registro", "Alteração", "Visualizar estrutura"];
    checkboxes.slice(0, permissionNames.length).forEach((item, index) => {
        permissions[permissionNames[index]] = Boolean(item.checked);
    });
    const details = {};
    for (const item of values) {
        const context = normalize(item.context);
        if (context.includes("papel") && item.value)
            details.Papel = clean(item.value);
        if (context.includes("nome") && item.value)
            details.Nome = clean(item.value);
        if (context.includes("email") && item.value)
            details.Email = clean(item.value);
        if (context.includes("celular") && item.value)
            details.Celular = clean(item.value);
    }
    const selectedValues = values.filter((item) => item.tag === "select" && item.value).map((item) => clean(item.value));
    if (!details.Cliente && selectedValues[0])
        details.Cliente = selectedValues[0];
    if (!details.Papel && selectedValues[1])
        details.Papel = selectedValues[1];
    if (!details.Cliente)
        details.Cliente = await selectedClient(page);
    return { details, permissions };
}
async function executeDirectedQuery(page, plan) {
    const route = resolveRoute(plan.routeLabel);
    await page.goto(route, { waitUntil: "networkidle" });
    if (plan.target === "user") {
        await page.getByRole("button", { name: /^usu[aá]rios$/i }).first().click().catch(() => undefined);
    }
    await fillDirectedFilter(page, plan);
    const table = await extractTable(page, plan.value);
    const limitations = [];
    let details;
    let permissions;
    if (plan.target === "user" && table.rows.length > 0) {
        const detailResult = await safeOpenUserDetails(page, plan.value);
        details = detailResult.details;
        permissions = detailResult.permissions;
        if (detailResult.limitation)
            limitations.push(detailResult.limitation);
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
function saveSanitizedEvidence(question, evidence) {
    const directory = path_1.default.join("outputs", "runtime-evidence");
    fs_1.default.mkdirSync(directory, { recursive: true });
    const outputPath = path_1.default.join(directory, `directed-${Date.now()}.json`);
    const serialized = sanitizeForLog(JSON.stringify({ question, evidence }, null, 2));
    fs_1.default.writeFileSync(outputPath, serialized, "utf-8");
    return outputPath;
}
async function consultarAplicacao(pergunta, interpretation) {
    if (process.env.ALLOW_PLAYWRIGHT !== "true") {
        return { used: false, evidence: "Playwright desabilitado." };
    }
    const plan = planDirectedQuery(pergunta, interpretation);
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        if (plan) {
            const evidence = await executeDirectedQuery(page, plan);
            const savedPath = saveSanitizedEvidence(pergunta, evidence);
            return { used: true, evidence, savedPath };
        }
        const title = await page.title();
        const url = page.url();
        const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) => elements.map((el) => ({
            text: (el.textContent || "").trim(),
            href: el instanceof HTMLAnchorElement ? el.href : ""
        })).filter((item) => item.text || item.href).slice(0, 50));
        return { used: true, evidence: { title, url, menus, question: pergunta } };
    }
    finally {
        await browser.close();
    }
}
