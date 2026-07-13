import { loginBlunana } from "../../crawler-interface/auth/login";

export async function consultarAplicacao(pergunta: string) {
  if (process.env.ALLOW_PLAYWRIGHT !== "true") {
    return {
      used: false,
      evidence: "Playwright desabilitado.",
    };
  }

  const { browser, page } = await loginBlunana();

  try {
    const title = await page.title();
    const url = page.url();

    const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) =>
      elements
        .map((el) => ({
          text: (el.textContent || "").trim(),
          href: el instanceof HTMLAnchorElement ? el.href : "",
        }))
        .filter((item) => item.text || item.href)
        .slice(0, 50)
    );

    return {
      used: true,
      evidence: {
        title,
        url,
        menus,
        question: pergunta,
      },
    };
  } finally {
    await browser.close();
  }
}