import fs from "fs";
import path from "path";

export type SearchResult = {
  file: string;
  content: string;
  score: number;
};

function listarArquivos(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return listarArquivos(full);

    if (
      entry.name.endsWith(".md") ||
      entry.name.endsWith(".json") ||
      entry.name.endsWith(".txt")
    ) {
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

export function buscar(pergunta: string, fontes: string[]): SearchResult[] {
  const termos = normalizar(pergunta).split(/\s+/).filter(Boolean);
  const arquivos = fontes.flatMap(listarArquivos);

  return arquivos
    .map((file) => {
      const content = fs.readFileSync(file, "utf-8");
      const base = normalizar(`${file}\n${content}`);

      const score = termos.filter((termo) => base.includes(termo)).length;

      return { file, content, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}