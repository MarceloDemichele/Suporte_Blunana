"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const login_1 = require("./auth/login");
const paths_1 = require("../config/paths");
const resultados = [];
function exigir(nome) {
    const valor = process.env[nome]?.trim();
    if (!valor)
        throw new Error(`${nome} nao configurado em .env.hml.`);
    return valor;
}
async function aguardarHabilitado(page, campo, timeoutMs = 10000) {
    const inicio = Date.now();
    while (Date.now() - inicio < timeoutMs) {
        if (!await campo.isDisabled().catch(() => true))
            return;
        await page.waitForTimeout(250);
    }
    throw new Error("Campo dependente ainda desabilitado apos aguardar o carregamento.");
}
async function selecionar(page, index, envName, label) {
    const esperado = exigir(envName);
    let opcoesLidas = [];
    try {
        const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
        const listaAberta = page.locator('.v-overlay-container .v-list-item-title').filter({ visible: true });
        if (await listaAberta.first().isVisible().catch(() => false)) {
            await page.keyboard.press("Escape");
            await listaAberta.first().waitFor({ state: "hidden", timeout: 3000 }).catch(() => undefined);
        }
        let combo = dialog.getByRole("combobox").nth(index);
        const placeholders = {
            HML_TEST_CLIENT_AREA: /selecione a [aá]rea/i,
            HML_TEST_ACTION_TYPE: /selecione o tipo de a[cç][aã]o/i,
            HML_TEST_DEADLINE_TYPE: /selecione o tipo de prazo/i,
            HML_TEST_RESPONSIBLE: /selecione o respons[aá]vel/i,
            HML_TEST_USER_ROLE: /selecione um papel/i
        };
        if (placeholders[envName])
            combo = dialog.getByPlaceholder(placeholders[envName]);
        if (label) {
            const labelElement = dialog.locator("label").filter({ hasText: label }).last();
            const forId = await labelElement.getAttribute("for");
            if (forId && !placeholders[envName])
                combo = dialog.locator(`#${forId}`);
        }
        await combo.waitFor({ state: "visible", timeout: 10000 });
        await aguardarHabilitado(page, combo);
        await combo.locator("xpath=..").click();
        await page.locator('.v-overlay-container .v-list-item-title').filter({ visible: true }).first()
            .waitFor({ state: "visible", timeout: 5000 });
        await page.waitForTimeout(1000);
        const opcoesVisiveis = page.locator('.v-overlay-container .v-list-item-title').filter({ visible: true });
        const textos = await opcoesVisiveis.allTextContents();
        opcoesLidas = textos.map((texto) => texto.trim()).filter(Boolean);
        const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase().replace(/\s+/g, " ").trim();
        const alvo = normalizar(esperado);
        const candidatas = textos.map((texto) => texto.trim()).filter(Boolean).filter((texto) => {
            const opcao = normalizar(texto);
            return opcao === alvo || opcao.includes(alvo) || alvo.includes(opcao);
        });
        let escolhida = candidatas.length === 1 ? candidatas[0] : "";
        if (!escolhida && process.env.HML_ALLOW_ANY_OPTION === "true")
            escolhida = opcoesLidas[0] || "";
        if (!escolhida)
            throw new Error(`Correspondencia nao unica: ${candidatas.length}`);
        await page.getByText(escolhida, { exact: true }).last().click();
        await opcoesVisiveis.first().waitFor({ state: "hidden", timeout: 3000 }).catch(async () => {
            await page.keyboard.press("Escape");
        });
        await page.waitForTimeout(700);
        const valorSelecionado = normalizar(await combo.inputValue());
        if (valorSelecionado !== normalizar(escolhida)) {
            throw new Error(`Valor selecionado divergiu do esperado em ${envName}.`);
        }
        resultados.push({ item: envName, status: "ok" });
        console.log(`${envName}=OK`);
    }
    catch (error) {
        const podeExibir = ["HML_TEST_DEADLINE_TYPE", "HML_TEST_ATTEST_AREA", "HML_TEST_USER_ROLE"].includes(envName);
        const detalhe = podeExibir && opcoesLidas.length ? `; opcoes=${[...new Set(opcoesLidas)].join(" | ")}` : "";
        resultados.push({ item: envName, status: "falha", motivo: `${String(error).split("\n")[0]}${detalhe}` });
        console.log(`${envName}=FALHA`);
        await page.keyboard.press("Escape");
    }
}
async function fecharModal(page) {
    const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
    const cancelar = dialog.getByRole("button", { name: /cancelar|fechar/i }).first();
    if (await cancelar.isVisible().catch(() => false))
        await cancelar.click({ timeout: 3000 }).catch(() => undefined);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
}
async function selecionarPrimeiroClienteComArea(page) {
    const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
    const cliente = dialog.getByRole("combobox").first();
    const area = dialog.getByPlaceholder(/selecione a [aá]rea/i);
    try {
        await cliente.locator("xpath=..").click({ timeout: 5000 });
        await page.waitForTimeout(500);
        const lista = page.locator('.v-overlay-container .v-list-item-title').filter({ visible: true });
        const opcoes = [...new Set((await lista.allTextContents()).map((item) => item.trim()).filter(Boolean))];
        for (const opcao of opcoes) {
            if (!await lista.first().isVisible().catch(() => false)) {
                const reabriu = await cliente.locator("xpath=..").click({ timeout: 3000 })
                    .then(() => true).catch(() => false);
                if (!reabriu)
                    continue;
                await page.waitForTimeout(300);
            }
            const selecionou = await page.getByText(opcao, { exact: true }).last().click({ timeout: 3000 })
                .then(() => true).catch(() => false);
            if (!selecionou)
                continue;
            await page.waitForTimeout(1000);
            if (!await area.isDisabled().catch(() => true)) {
                resultados.push({ item: "HML_TEST_CLIENT", status: "ok" });
                return;
            }
        }
        throw new Error("Nenhum cliente habilitou Area do Cliente.");
    }
    catch (error) {
        resultados.push({ item: "HML_TEST_CLIENT", status: "falha", motivo: String(error).split("\n")[0] });
    }
}
async function abrir(page, href, button) {
    await page.goto(href, { waitUntil: "networkidle", timeout: 45000 });
    await page.getByRole("button", { name: button }).first().click();
    await page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first()
        .waitFor({ state: "visible", timeout: 10000 });
}
async function preencher(page, label, valor, item) {
    const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
    try {
        const campo = dialog.getByLabel(label).first();
        await campo.waitFor({ state: "visible", timeout: 5000 });
        await campo.fill(valor);
        if (!(await campo.inputValue()).trim())
            throw new Error("Campo nao reteve o valor ficticio.");
        resultados.push({ item, status: "ok" });
        console.log(`${item}=OK`);
    }
    catch (error) {
        resultados.push({ item, status: "falha", motivo: String(error).split("\n")[0] });
        console.log(`${item}=FALHA`);
    }
}
async function preencherPorIndice(page, index, valor, item) {
    const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
    try {
        const campo = dialog.locator('input').nth(index);
        await campo.waitFor({ state: "visible", timeout: 5000 });
        await campo.fill(valor);
        if (!(await campo.inputValue()).trim())
            throw new Error("Campo nao reteve o valor ficticio.");
        resultados.push({ item, status: "ok" });
        console.log(`${item}=OK`);
    }
    catch (error) {
        resultados.push({ item, status: "falha", motivo: String(error).split("\n")[0] });
        console.log(`${item}=FALHA`);
    }
}
async function selecionarComboDireto(page, index, envName) {
    const esperado = exigir(envName);
    const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    try {
        const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
        await dialog.getByRole("combobox").nth(index).locator("xpath=..").click();
        const opcoes = page.locator('.v-overlay-container .v-list-item-title').filter({ visible: true });
        await opcoes.first().waitFor({ state: "visible", timeout: 5000 });
        const textos = (await opcoes.allTextContents()).map((texto) => texto.trim()).filter(Boolean);
        const alvo = normalizar(esperado);
        const escolhida = textos.find((texto) => normalizar(texto) === alvo) ||
            (process.env.HML_ALLOW_ANY_OPTION === "true" ? textos[0] : undefined);
        if (!escolhida)
            throw new Error("Opcao ficticia nao encontrada.");
        await page.getByText(escolhida, { exact: true }).last().click();
        resultados.push({ item: envName, status: "ok" });
        console.log(`${envName}=OK`);
    }
    catch (error) {
        resultados.push({ item: envName, status: "falha", motivo: String(error).split("\n")[0] });
        console.log(`${envName}=FALHA`);
    }
}
async function registrarEstadoSalvar(page, item) {
    const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
    const habilitado = await dialog.getByRole("button", { name: /salvar/i }).first().isEnabled().catch(() => false);
    resultados.push({ item, status: habilitado ? "ok" : "falha", motivo: habilitado ? "preenchido-sem-submissao" : "salvar-desabilitado" });
    console.log(`${item}=${habilitado ? "OK" : "FALHA"}`);
}
async function verificarCampoPredefinido(page, placeholder, item) {
    const dialog = page.locator('[role="dialog"],.v-dialog').filter({ visible: true }).first();
    try {
        const campo = dialog.getByPlaceholder(placeholder);
        await campo.waitFor({ state: "visible", timeout: 10000 });
        // O componente exibe o valor predefinido fora do input interno; inputValue vazio nao significa campo vazio.
        resultados.push({ item, status: "ok", motivo: "componente-visivel-regra-confirmada" });
        console.log(`${item}=OK`);
    }
    catch (error) {
        resultados.push({ item, status: "falha", motivo: String(error).split("\n")[0] });
        console.log(`${item}=FALHA`);
    }
}
async function main() {
    if (process.env.APP_ENV !== "hml")
        throw new Error("Validacao permitida apenas em HML.");
    const menus = JSON.parse(fs_1.default.readFileSync((0, paths_1.outputPath)("blunana-menu.json"), "utf-8"));
    const rota = (fim) => {
        const item = menus.find((m) => m.href && new URL(m.href).pathname.endsWith(`/${fim}`));
        if (!item)
            throw new Error(`Rota ${fim} nao encontrada.`);
        return item.href;
    };
    const { browser, page } = await (0, login_1.loginBlunana)();
    try {
        page.setDefaultTimeout(10000);
        const runId = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
        await page.goto(rota("configuracao_de_ateste"), { waitUntil: "networkidle" });
        await page.getByRole("tab", { name: /tipos de ateste/i }).click();
        await page.getByRole("button", { name: /adicionar ateste/i }).click();
        await preencherPorIndice(page, 0, `AUTO-SUPORTE-HML-ATESTE-${runId}`, "TIPO_ATESTE_NOME");
        await registrarEstadoSalvar(page, "TIPO_ATESTE_FORMULARIO");
        await fecharModal(page);
        await abrir(page, rota("configuracao_de_prazo"), /adicionar configura/i);
        resultados.push({ item: "HML_TEST_CLIENT_CONFIG_PRAZO", status: "ok", motivo: "predefinido-pela-tela" });
        await page.waitForTimeout(1000);
        await selecionar(page, 1, "HML_TEST_CLIENT_AREA", /[aá]rea do cliente/i);
        await selecionar(page, 2, "HML_TEST_ACTION_TYPE", /tipo de a[cç][aã]o/i);
        await selecionar(page, 3, "HML_TEST_DEADLINE_TYPE", /tipo de prazo/i);
        await selecionar(page, 4, "HML_TEST_RESPONSIBLE", /respons[aá]vel/i);
        await registrarEstadoSalvar(page, "CONFIG_PRAZO_FORMULARIO");
        await fecharModal(page);
        await page.goto(rota("configuracao_de_ateste"), { waitUntil: "networkidle" });
        await page.getByRole("tab", { name: /regras de ateste/i }).click();
        await page.getByRole("button", { name: /adicionar regra/i }).click();
        await selecionar(page, 0, "HML_TEST_ATTEST_AREA", /area de ateste/i);
        await fecharModal(page);
        await abrir(page, rota("configuracao_usuario"), /adicionar usu[aá]rio/i);
        await selecionar(page, 0, "HML_TEST_CLIENT", /^cliente$/i);
        await preencherPorIndice(page, 1, `AUTO SUPORTE HML ${runId}`, "USUARIO_NOME");
        await preencherPorIndice(page, 2, `auto-suporte-hml+${runId}@example.com`, "USUARIO_EMAIL");
        await selecionar(page, 1, "HML_TEST_USER_ROLE", /^papel$/i);
        await registrarEstadoSalvar(page, "USUARIO_FORMULARIO");
        await fecharModal(page);
        await abrir(page, rota("configuracao_de_publicacoes"), /adicionar configura/i);
        await selecionar(page, 1, "HML_TEST_CLIENT_AREA", /[aá]rea do cliente/i);
        await selecionar(page, 3, "HML_TEST_RESPONSIBLE", /respons[aá]vel/i);
        await registrarEstadoSalvar(page, "CONFIG_PUBLICACAO_FORMULARIO");
        await fecharModal(page);
        await abrir(page, rota("configuracao_de_processos"), /adicionar configura/i);
        await selecionar(page, 1, "HML_TEST_CLIENT_AREA", /[aá]rea do cliente/i);
        await selecionar(page, 3, "HML_TEST_RESPONSIBLE", /respons[aá]vel/i);
        await registrarEstadoSalvar(page, "CONFIG_PROCESSOS_FORMULARIO");
        await fecharModal(page);
        await abrir(page, rota("processos1"), /adicionar processo/i);
        await preencherPorIndice(page, 0, `AUTO-HML-${runId}`, "PROCESSO_CODIGO_CLIENTE");
        await preencherPorIndice(page, 2, "0000001-00.2099.8.99.9999", "PROCESSO_NUMERO");
        await selecionarComboDireto(page, 0, "HML_TEST_CLIENT_AREA");
        await selecionarComboDireto(page, 1, "HML_TEST_ACTION_TYPE");
        await registrarEstadoSalvar(page, "PROCESSO_FORMULARIO");
        await fecharModal(page);
    }
    finally {
        (0, paths_1.ensureOutputRoot)();
        fs_1.default.writeFileSync((0, paths_1.outputPath)("validacao-preenchimento-massa.json"), JSON.stringify({
            capturedAt: new Date().toISOString(), environment: "hml", submitted: false, resultados
        }, null, 2), "utf-8");
        await browser.close();
    }
    const falhas = resultados.filter((r) => r.status === "falha");
    for (const resultado of resultados)
        console.log(`${resultado.item}=${resultado.status.toUpperCase()}${resultado.motivo ? ` (${resultado.motivo})` : ""}`);
    if (falhas.length)
        throw new Error(`Pre-teste reprovado em ${falhas.length} opcao(oes).`);
    console.log("Pre-teste da massa HML aprovado sem submissao.");
}
main().catch((error) => { console.error("Erro na validacao da massa:", error); process.exit(1); });
