import { loginBlunana } from "./auth/login";
import { coletarMenu } from "./collectors/menu.collector";

async function main() {
  const { browser, page } = await loginBlunana();
  try {
    await coletarMenu(page);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Erro ao coletar menu:", error);
  process.exit(1);
});
