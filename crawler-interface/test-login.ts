import { loginBlunana } from "./auth/login";

async function main() {
  const { browser, page } = await loginBlunana();

  console.log("Login executado.");
  console.log("URL atual:", page.url());

  await browser.close();
}

main().catch((error) => {
  console.error("Erro no teste de login:", error);
  process.exit(1);
});
