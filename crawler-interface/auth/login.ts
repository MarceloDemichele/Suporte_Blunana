import { criarSessao } from "./session";
import { gerarCodigoMFA } from "./mfa";

export async function loginBlunana() {
  const { browser, page } = await criarSessao();

  const url = process.env.APP_URL!;
  const user = process.env.APP_USER!;
  const password = process.env.APP_PASSWORD!;
  const secret = process.env.MFA_SECRET!;

  await page.goto(url, { waitUntil: "networkidle" });

  await page.fill('input[type="text"], input[name="username"], input[name="email"]', user);
  await page.fill('input[type="password"]', password);

  await page.click('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")');

  const codigoMFA = gerarCodigoMFA(secret);

  const campoMFA = page.locator('input[type="text"], input[name="code"], input[name="token"]').first();

  if (await campoMFA.isVisible({ timeout: 10000 }).catch(() => false)) {
    await campoMFA.fill(codigoMFA);
    await page.click('button[type="submit"], button:has-text("Confirmar"), button:has-text("Validar")');
  }

  await page.waitForLoadState("networkidle");

  return { browser, page };
}
