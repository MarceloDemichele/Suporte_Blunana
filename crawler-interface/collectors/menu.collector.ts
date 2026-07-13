import { Page } from "playwright";
import fs from "fs";
import { ensureOutputRoot, outputPath } from "../../config/paths";

export async function coletarMenu(page: Page) {
  await page.waitForLoadState("networkidle");

  const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) =>
    elements
      .map((el) => ({
        texto: (el.textContent || "").trim(),
        href: el instanceof HTMLAnchorElement ? el.href : "",
        ariaLabel: el.getAttribute("aria-label") || "",
        title: el.getAttribute("title") || "",
      }))
      .filter((item) => item.texto || item.href || item.ariaLabel || item.title)
  );

  ensureOutputRoot();

  fs.writeFileSync(
    outputPath("blunana-menu.json"),
    JSON.stringify(menus, null, 2),
    "utf-8"
  );

  console.log(`Menus coletados: ${menus.length}`);
}
