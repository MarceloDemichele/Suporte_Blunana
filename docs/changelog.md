# Changelog

## 2026-07-07

- Ajustados os caminhos dos artefatos do crawler TypeScript para serem separados por ambiente via `config/paths.ts`.
- Definido `npm test` para executar `screens:prod` e adicionado `npm run docs:prod`.
- Documentado que artefatos de producao devem ser gerados em `outputs/{tipo}/blunana/prod/`, com execucao real marcada como ponto a validar.
- Criado `prompts/09-engenharia-reversa-blunana-prod.md` para orientar engenharia reversa controlada do Blunana em producao.
- Gerada documentacao de engenharia reversa Blunana em `engenharia-reversa/blunana/`, com 43 rotas/telas inventariadas a partir dos artefatos existentes.
- Criado executor `crawler-interface/reverse-prod.ts` e script `npm run reverse:prod` para orquestrar login, coleta de menu/telas e inventario PROD.
- Corrigidos links de navegacao e engenharia reversa Blunana para `https://epm.blueprojects.com.br/@rocha_juridico/studio/auth/login` como URL de login e tenant `@rocha_juridico` nas rotas mapeadas.
- Organizada a separacao de artefatos por dominio e ambiente: `outputs/{tipo}/blunana/{dev,hml,prod}` e `outputs/{tipo}/robos/{dev,hml,prod}`.
- Reorganizada a raiz de engenharia reversa para `engenharia-reversa/`, separando `robo-cef/`, `blunana/`, `integrações/`, `banco/`, `api/`, `frontend/` e `backend/`, e reservando `outputs/` para `logs/`, `json/`, `screenshots/`, `relatorios/` e `temp/`.
- Criada estrutura dedicada ao futuro Assistente IA CEF em `external-agent/`, com entrada `index.ts`, README e subpastas para config, core, context, providers, services, prompts, tools, cache e logs.
- Criado `index/master-index.json` para o Assistente IA CEF consultar um indice mestre antes de procurar arquivos diretamente.
- Criado `external-agent/config/paths.ts` para centralizar fontes locais do Assistente IA CEF.
- Criado `external-agent/core/search.ts` para busca recursiva em arquivos Markdown e JSON.
- Atualizado `external-agent/index.ts` como executor inicial do Assistente IA CEF, recebendo pergunta por argumento e imprimindo fontes encontradas.
