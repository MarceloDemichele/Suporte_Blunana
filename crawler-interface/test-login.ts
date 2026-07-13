import { loginBlunana } from "./auth/login";
import { ensureOutputScreenshotsRoot, outputScreenshotsPath } from "../config/paths";

async function main() {
  const { browser, page } = await loginBlunana();

  console.log("Login executado.");
  console.log("URL atual:", page.url());

  ensureOutputScreenshotsRoot();
  await page.screenshot({ path: outputScreenshotsPath("login-teste.png"), fullPage: true });

  await browser.close();
}

main().catch((error) => {
  console.error("Erro no teste de login:", error);
  process.exit(1);
});
