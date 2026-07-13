import fs from "fs";
import path from "path";
import { Page } from "playwright";
import { loginBlunana } from "../../crawler-interface/auth/login";

type NavigationEvidence = {
  used: boolean;
  currentUrl?: string;
  title?: string;
  menus?: Array<{
    text: string;
    href: string;
  }>;
  fields?: string[];
  buttons?: string[];
  links?: string[];
  savedPath?: string;
  error?: string;
};

function sanitize(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL_REMOVIDO]")
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF_REMOVIDO]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ_REMOVIDO]")
    .trim();
}

async function extractPageEvidence(page: Page): Promise<NavigationEvidence> {
  const title = await page.title();
  const currentUrl = page.url();

  const menus = await page.locator("a, button, [role='menuitem']").evaluateAll((elements) =>
    elements
      .map((el) => ({
        text: (el.textContent || "").trim(),
        href: el instanceof HTMLAnchorElement ? el.href : "",
      }))
      .filter((item) => item.text || item.href)
      .slice(0, 80)
  );

  const fields = await page.locator("input, textarea, select").evaluateAll((elements) =>
    elements
      .map((el) => {
        const label =
          el.getAttribute("aria-label") ||
          el.getAttribute("placeholder") ||
          el.getAttribute("name") ||
          el.getAttribute("id") ||
          "";
        return label.trim();
      })
      .filter(Boolean)
      .slice(0, 80)
  );

  const buttons = await page.locator("button").evaluateAll((elements) =>
    elements
      .map((el) => (el.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 80)
  );

  const links = await page.locator("a").evaluateAll((elements) =>
    elements
      .map((el) => (el.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 80)
  );

  return {
    used: true,
    currentUrl: sanitize(currentUrl),
    title: sanitize(title),
    menus: menus.map((m) => ({
      text: sanitize(m.text),
      href: sanitize(m.href),
    })),
    fields: fields.map(sanitize),
    buttons: buttons.map(sanitize),
    links: links.map(sanitize),
  };
}

export async function runNavigation(question: string): Promise<NavigationEvidence> {
  if (process.env.ALLOW_PLAYWRIGHT !== "true") {
    return {
      used: false,
      error: "Playwright desabilitado.",
    };
  }

  const { browser, page } = await loginBlunana();

  try {
    await page.waitForLoadState("networkidle");

    const evidence = await extractPageEvidence(page);

    fs.mkdirSync("outputs/runtime-evidence", { recursive: true });

    const fileName = `evidence-${Date.now()}.json`;
    const savedPath = path.join("outputs/runtime-evidence", fileName);

    fs.writeFileSync(
      savedPath,
      JSON.stringify(
        {
          question,
          capturedAt: new Date().toISOString(),
          evidence,
        },
        null,
        2
      ),
      "utf-8"
    );

    return {
      ...evidence,
      savedPath,
    };
  } catch (error) {
    return {
      used: true,
      error: String(error),
    };
  } finally {
    await browser.close();
  }
}