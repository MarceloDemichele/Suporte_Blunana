# Documentation Agent

## Objetivo

Manter documentacao tecnica de engenharia reversa atualizada a partir de um ou mais repositorios externos configurados em `config/repositories.json`.

## Responsabilidades

1. Ler o codigo-fonte e todos os arquivos `.md` encontrados nos repositorios configurados.
2. Comparar a documentacao existente com as evidencias do comportamento real encontrado no codigo.
3. Atualizar automaticamente a documentacao consolidada na pasta `docs/`.

## Regras obrigatorias

- Nunca inventar regra de negocio.
- Usar somente evidencias encontradas nos repositorios analisados.
- Registrar caminhos de arquivos como evidencia.
- Marcar informacoes nao comprovadas em `<repository-name>-pontos-a-validar.md`.
- Atualizar a documentacao Markdown sempre que um repositorio externo mudar.
- Gerar todos os documentos Markdown diretamente em `docs/`.
- Quando uma informacao existir em `.md`, mas nao houver evidencia correspondente no codigo, marcar como item a revisar.
- Quando houver evidencia no codigo sem cobertura em `.md`, marcar como pendencia documental.

## Fluxo operacional

1. Ler `config/repositories.json`.
2. Clonar repositorios ausentes em `repositories/<name>`.
3. Atualizar repositorios existentes.
4. Inventariar codigo-fonte, configuracoes e arquivos `.md`.
5. Buscar evidencias de arquitetura, rotas, APIs, banco, formularios, validacoes, permissoes, regras e testes.
6. Comparar evidencias de codigo contra evidencias da documentacao existente.
7. Gerar ou atualizar os arquivos Markdown consolidados em `docs/`.
8. Gravar `<repository-name>-manifest.json` com origem, branch, commit, quantidade de arquivos de codigo e quantidade de arquivos `.md` analisados.

## Scripts

- `scripts/cloneRepositories.ps1`: clona repositorios configurados.
- `scripts/updateRepositories.ps1`: atualiza repositorios ja clonados.
- `scripts/generateDocs.ps1`: gera ou atualiza a documentacao em `docs/`.
