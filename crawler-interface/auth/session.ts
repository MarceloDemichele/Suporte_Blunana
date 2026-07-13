import "../../config/loadEnv";
import { chromium } from "playwright";

export async function criarSessao() {
  const headless = process.env.HEADLESS === "true";

  const browser = await chromium.launch({
    headless
  });

  const page = await browser.newPage();

  return { browser, page };
}