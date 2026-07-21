import fs from "fs";
import path from "path";
import type { QuestionInterpretation } from "./question-interpreter";

export type SearchResult = { file: string; content: string; score: number };

function listarArquivos(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    const normalized = full.replace(/\\/g, "/").toLowerCase();
    if (/outputs\/(json|relatorios)\/blunana\/(dev|hml)(\/|$)/.test(normalized)) return [];
    if (entry.isDirectory()) return listarArquivos(full);
    return /\.(md|json|txt)$/.test(entry.name) ? [full] : [];
  });
}

function normalizar(texto: string): string {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const stopwords = new Set([
  "a", "ao", "aos", "as", "como", "da", "das", "de", "do", "dos",
  "e", "em", "eu", "o", "os", "para", "por", "que", "um", "uma"
]);

function prioridadeFonte(file: string): number {
  const normalized = file.replace(/\\/g, "/").toLowerCase();
  if (/outputs\/json\/blunana\/prod\/.*-tela\.json$/.test(normalized)) return 45;
  if (normalized.includes("blunana-menu.json")) return 40;
  if (normalized.includes("blunana-telas.json")) return 35;
  if (normalized.startsWith("support/")) return 25;
  if (normalized.startsWith("knowledge/")) return 20;
  if (normalized.startsWith("docs/")) return 15;
  if (normalized.startsWith("engenharia-reversa/")) return 10;
  if (normalized.startsWith(".memory/")) return 0;
  return 5;
}

export function buscar(pergunta: string, fontes: string[]): SearchResult[] {
  const termos = normalizar(pergunta)
    .split(/\s+/)
    .map((termo) => termo.replace(/[^a-z0-9_-]/g, ""))
    .filter((termo) => termo.length > 2 && !stopwords.has(termo));
  const arquivos = fontes.flatMap(listarArquivos);

  return arquivos.map((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const base = normalizar(`${file}\n${content}`);
    const matches = termos.filter((termo) => base.includes(termo)).length;
    const score = matches > 0 ? matches * 100 + prioridadeFonte(file) : 0;
    return { file, content, score };
  }).filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function buscarComInterpretacao(interpretation: QuestionInterpretation, fontes: string[]): SearchResult[] {
  const semanticQuery = [interpretation.original, ...interpretation.concepts].join(" ");
  return buscar(semanticQuery, fontes);
}
