"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
function listarArquivos(dir) {
    if (!fs_1.default.existsSync(dir))
        return [];
    return fs_1.default.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path_1.default.join(dir, entry.name);
        if (entry.isDirectory())
            return listarArquivos(full);
        if (entry.name.endsWith(".md") || entry.name.endsWith(".json")) {
            return [full];
        }
        return [];
    });
}
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
function main() {
    const arquivos = fontes.flatMap(listarArquivos);
    const index = {};
    for (const termo of termosBase) {
        index[termo] = [];
    }
    for (const file of arquivos) {
        const content = normalizar(fs_1.default.readFileSync(file, "utf-8"));
        const nomeArquivo = normalizar(file);
        for (const termo of termosBase) {
            const termoNorm = normalizar(termo);
            if (content.includes(termoNorm) || nomeArquivo.includes(termoNorm)) {
                index[termo].push(file);
            }
        }
    }
    fs_1.default.mkdirSync("index", { recursive: true });
    fs_1.default.writeFileSync("index/master-index.json", JSON.stringify(index, null, 2), "utf-8");
    console.log("Índice gerado em index/master-index.json");
    console.log(`Arquivos analisados: ${arquivos.length}`);
}
main();
