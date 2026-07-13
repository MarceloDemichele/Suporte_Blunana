import { loginBlunana } from "./auth/login";
import { coletarMenu } from "./collectors/menu.collector";
import { ensureOutputScreenshotsRoot, outputScreenshotsPath } from "../config/paths";

async function main() {
  const { browser, page } = await loginBlunana();

  await coletarMenu(page);

  ensureOutputScreenshotsRoot();
  await page.screenshot({
    path: outputScreenshotsPath("menu-teste.png"),
    fullPage: true,
  });

  await browser.close();
}

main().catch((error) => {
  console.error("Erro ao coletar menu:", error);
  process.exit(1);
});
