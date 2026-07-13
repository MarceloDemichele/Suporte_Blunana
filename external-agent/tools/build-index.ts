import fs from "fs";
import path from "path";

const fontes = [
  "docs",
  "knowledge",
  ".memory",
  "engenharia-reversa",
  "tickets",
  "support",
];

const termosBase = [
  "blunana",
  "robo",
  "cef",
  "login",
  "mfa",
  "usuario",
  "usuarios",
  "empresa",
  "empresas",
  "notificacao",
  "notificacoes",
  "normativo",
  "normativos",
  "publicacao",
  "publicacoes",
  "tarefa",
  "tarefas",
  "cliente",
  "suporte",
  "erro",
  "bug",
  "permissao",
  "perfil",
];

function listarArquivos(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return listarArquivos(full);

    if (entry.name.endsWith(".md") || entry.name.endsWith(".json")) {
      return [full];
    }

    return [];
  });
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function main() {
  const arquivos = fontes.flatMap(listarArquivos);

  const index: Record<string, string[]> = {};

  for (const termo of termosBase) {
    index[termo] = [];
  }

  for (const file of arquivos) {
    const content = normalizar(fs.readFileSync(file, "utf-8"));
    const nomeArquivo = normalizar(file);

    for (const termo of termosBase) {
      const termoNorm = normalizar(termo);

      if (content.includes(termoNorm) || nomeArquivo.includes(termoNorm)) {
        index[termo].push(file);
      }
    }
  }

  fs.mkdirSync("index", { recursive: true });

  fs.writeFileSync(
    "index/master-index.json",
    JSON.stringify(index, null, 2),
    "utf-8"
  );

  console.log("Índice gerado em index/master-index.json");
  console.log(`Arquivos analisados: ${arquivos.length}`);
}

main();