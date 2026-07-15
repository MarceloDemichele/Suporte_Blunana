# Decisões

## 2026-07-14 - Consultas somente em PROD

Foi definido que o Suporte Blunana deve consultar exclusivamente o ambiente de producao (`APP_ENV=prod`). DEV e HML nao podem ser usados como fonte de evidencia para respostas aos clientes.

Impacto

- A navegacao Playwright deve bloquear ambientes diferentes de PROD.
- Inventarios DEV/HML nao podem fundamentar respostas operacionais.
- Evidencias historicas de DEV permanecem apenas como material tecnico, sem validade para atendimento.

Complemento de 2026-07-15: HML foi autorizado como ambiente de exploracao funcional e testes transacionais controlados, pois a equipe informou que ele utiliza a mesma versao de PROD. PROD permanece como fonte final de validacao para respostas aos clientes.

## 2026-07-15 - Escopo limitado a Configuracoes e Menu

PROD e HML devem tratar os dois grupos laterais `Configuracoes` e `Menu` e seus 13 submenus aprovados em `docs/escopo-funcional-ativo.md`. A equipe confirmou que ambos os ambientes estao equivalentes nesse recorte.

## 2026-07-15 - Autonomia de mapeamento em HML

A equipe autorizou navegacao autonoma e criacao de memorias nas 13 telas do escopo, sem aprovacao manual por tela. O agente pode abrir paginas, abas e modais nao destrutivos. Confirmacao de inclusao, alteracao ou exclusao permanece bloqueada ate existir massa de teste descartavel e regra de limpeza.

## 2026-07-13

Foi definido o escopo ativo como fluxo de suporte Blunana.

Motivo

Centralizar o projeto em análise documental, navegação, resposta ao cliente e atualização de documentação.

Impacto

Os diretórios de contexto prioritários passaram a ser `docs/`, `engenharia-reversa/`, `support/`, `knowledge/` e `outputs/`.

## 2026-07-07

Foi definida a organização de artefatos por tipo, domínio e ambiente.

Motivo

Separar evidências, relatórios e documentação sem misturar contextos de execução.

Impacto

Os artefatos gerados passaram a ficar em `outputs/{tipo}/{dominio}/{ambiente}` e a documentação consolidada passou a ficar em `engenharia-reversa/`.

## 2026-07-06

Foi consolidada a base inicial de conhecimento, tickets e respostas de suporte.

Motivo

Dar sustentação aos atendimentos e à atualização documental com evidências locais.

Impacto

O fluxo passou a depender de `knowledge/`, `docs/`, `tickets/`, `support/` e `outputs/` como fontes principais.
