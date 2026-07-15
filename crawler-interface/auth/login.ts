import { criarSessao } from "./session";

export async function loginBlunana() {
  const environment = process.env.APP_ENV || "prod";
  const hmlMappingAllowed = environment === "hml" && process.env.ALLOW_HML_MAPPING === "true";
  if (environment !== "prod" && !hmlMappingAllowed) {
    throw new Error("Acesso permitido apenas em PROD ou em HML com ALLOW_HML_MAPPING=true.");
  }

  const exigir = (nome: string) => {
    const valor = process.env[nome]?.trim();
    if (!valor) throw new Error(`${nome} nao configurado em .env.${environment}.`);
    return valor;
  };

  const url = exigir("APP_URL");
  const user = exigir("APP_USER");
  const password = exigir("APP_PASSWORD");
  const secret = exigir("MFA_SECRET");
  const { browser, page } = await criarSessao();
  const network: Array<{ method: string; path: string; status: number }> = [];
  page.on("response", (response) => {
    const request = response.request();
    if (request.method() !== "GET") {
      const responseUrl = new URL(response.url());
      network.push({ method: request.method(), path: responseUrl.pathname, status: response.status() });
    }
  });

  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator('input[name="username"], input[name="email"], input[type="text"]').first().fill(user);
    await page.locator('input[type="password"]').first().fill(password);
    await page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first().click();

    const campoMFA = page.locator([
      'input[autocomplete="one-time-code"]',
      'input[name="code"]',
      'input[name="token"]',
      'input[name="otp"]',
      'input[name="mfa"]',
      'input[inputmode="numeric"]',
      'input[maxlength="6"]',
      'input[placeholder*="codigo" i]',
      'input[placeholder*="código" i]'
    ].join(", ")).first();

    await Promise.race([
      page.waitForURL((current) => !current.pathname.includes("/auth/login"), { timeout: 20000 }),
      campoMFA.waitFor({ state: "visible", timeout: 20000 })
    ]).catch(() => undefined);

    if (page.url().includes("/auth/login") && await campoMFA.isVisible().catch(() => false)) {
      const { gerarCodigoMFA } = await import("./mfa.js");
      const codigoMFA = await gerarCodigoMFA(secret);
      await campoMFA.fill(codigoMFA);

      const confirmar = page.locator(
        'button[type="submit"], button:has-text("Confirmar"), button:has-text("Validar")'
      ).first();
      await confirmar.waitFor({ state: "visible", timeout: 10000 });
      const aguardarRespostaOtp = () => page.waitForResponse((response) =>
        response.request().method() === "POST" && response.url().includes("/Security/CompleteOtpLogin"),
        { timeout: 15000 }
      );
      let respostaOtpPromise = aguardarRespostaOtp();
      await confirmar.click();
      let respostaOtp = await respostaOtpPromise;

      if (respostaOtp.status() === 409) {
        const esperaProximaJanela = 31000 - (Date.now() % 30000);
        await page.waitForTimeout(esperaProximaJanela);
        const novoCodigo = await gerarCodigoMFA(secret);
        await campoMFA.fill(novoCodigo);
        respostaOtpPromise = aguardarRespostaOtp();
        await confirmar.click();
        respostaOtp = await respostaOtpPromise;
      }

      if (respostaOtp.status() >= 400) {
        throw new Error(`Conclusao do MFA recusada com HTTP ${respostaOtp.status()}.`);
      }
    }

    await page.waitForURL((current) => !current.pathname.includes("/auth/login"), { timeout: 30000 });
    await page.waitForLoadState("networkidle");
    return { browser, page };
  } catch (error) {
    const diagnostico = await page.evaluate(() => ({
      path: window.location.pathname,
      fields: Array.from(document.querySelectorAll("input")).map((field) => ({
        type: field.type,
        name: field.name,
        id: field.id,
        placeholder: field.placeholder,
        autocomplete: field.autocomplete,
        inputMode: field.inputMode,
        maxLength: field.maxLength
      })),
      buttons: Array.from(document.querySelectorAll("button")).map((button) => ({
        text: (button.textContent || "").trim(),
        type: button.type,
        disabled: button.disabled,
        busy: button.getAttribute("aria-busy")
      })),
      messages: Array.from(document.querySelectorAll('[role="alert"], .alert, .error, .text-error, .v-messages__message'))
        .map((element) => (element.textContent || "").trim())
        .filter(Boolean)
        .slice(0, 10)
    })).catch(() => null);
    await browser.close();
    throw new Error(`${String(error)}\nDiagnostico seguro: ${JSON.stringify({ page: diagnostico, network })}`);
  }
}
