import { Page } from "playwright";
import fs from "fs";
import { currentEnvironment } from "../../config/environment";
import { ensureOutputScreenshotsRoot, outputPath, outputScreenshotsPath } from "../../config/paths";

type MenuItem = {
  texto: string;
  href: string;
  ariaLabel?: string;
  title?: string;
};

function nomeArquivoSeguro(valor: string) {
  return valor
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function coletarTelas(page: Page) {
  const menuPath = outputPath("blunana-menu.json");

  if (!fs.existsSync(menuPath)) {
    throw new Error(`Arquivo ${menuPath} nao encontrado. Execute primeiro npm run menu:${currentEnvironment}`);
  }

  const menus: MenuItem[] = JSON.parse(fs.readFileSync(menuPath, "utf-8"));

  const telas = menus
    .filter((item) => item.href)
    .filter((item, index, self) => index === self.findIndex((x) => x.href === item.href));

  ensureOutputScreenshotsRoot();

  const inventario = [];

  for (const tela of telas) {
    try {
      await page.goto(tela.href, { waitUntil: "networkidle" });

      const titulo = await page.title();
      const url = page.url();
      const h1 = await page.locator("h1").first().textContent().catch(() => "");
      const h2 = await page.locator("h2").first().textContent().catch(() => "");

      const nomeBase = nomeArquivoSeguro(tela.texto || tela.href);

      const screenshotPath = outputScreenshotsPath(`${nomeBase}.png`);
      const captureScreenshots = process.env.CAPTURE_SCREENSHOTS === "true";

      if (captureScreenshots) {
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
      }

      inventario.push({
        menu: tela.texto,
        url,
        titulo,
        h1: h1?.trim(),
        h2: h2?.trim(),
        screenshot: captureScreenshots ? screenshotPath : "desabilitado em produção",
      });

      console.log(`Tela coletada: ${tela.texto || tela.href}`);
    } catch (error) {
      inventario.push({
        menu: tela.texto,
        url: tela.href,
        erro: String(error),
      });

      console.log(`Erro ao coletar tela: ${tela.texto || tela.href}`);
    }
  }

  fs.writeFileSync(
    outputPath("blunana-telas.json"),
    JSON.stringify(inventario, null, 2),
    "utf-8"
  );

  console.log(`Total de telas coletadas: ${inventario.length}`);
}
