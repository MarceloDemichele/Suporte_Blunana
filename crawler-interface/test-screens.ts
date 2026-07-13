import { loginBlunana } from "./auth/login";
import { coletarMenu } from "./collectors/menu.collector";
import { coletarTelas } from "./collectors/screens.collector";

async function main() {
  const { browser, page } = await loginBlunana();

  await coletarMenu(page);
  await coletarTelas(page);

  await browser.close();
}

main().catch((error) => {
  console.error("Erro ao coletar telas:", error);
  process.exit(1);
});
