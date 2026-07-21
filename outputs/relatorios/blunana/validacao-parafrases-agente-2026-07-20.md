# Validação de paráfrases do agente — 2026-07-20

## Motivo

A bateria anterior aprovava 189 perguntas, mas 128 casos de regra reutilizavam literalmente o exemplo canônico, apenas com ou sem um prefixo. Isso não comprovava que perguntas semanticamente equivalentes, formuladas com outras palavras, mantinham a mesma intenção.

## Alterações validadas

- Inclusão de 26 consultas de tela com as formas `em qual menu encontro` e `qual o caminho para listar`.
- Inclusão de 3 variações operacionais para criação de prazo, cobrindo `lançar`, `registrar`, `abrir`, `qual o caminho` e `em qual menu`.
- Inclusão de 6 paráfrases de regras críticas: responsável do processo, exclusão, duplicidade de publicação, data fatal, ateste automático e duplicidade de audiência.
- Inclusão de 4 reformulações de consultas dinâmicas de usuário e processo.
- Inclusão de 3 planos de navegação direcionada com nomes de usuário expressos sem o formato rígido com hífen.

## Defeitos encontrados e corrigidos

1. A regra sobre filtro por perfil do usuário era classificada como consulta dinâmica de uma pessoa específica.
2. Uma pergunta contextualizada sobre parametrização de URL era desviada para consulta de tela.
3. Variações como `lançar um prazo`, `qual caminho` e `em qual menu` não eram reconhecidas como procedimento.
4. Consultas como `Quais permissões de <nome>?` não geravam plano direcionado.

## Evidências

- `npm run test:rules`: 64 regras e 6 variações aprovadas.
- `npm run test:battery`: 229 perguntas aprovadas.
- `npm run test:navigation`: 10 planos direcionados e 1 resposta sanitizada aprovados.
- `git diff --check`: aprovado, sem erro de whitespace; apenas avisos de conversão LF/CRLF do Git.
- Regressão adicional: `Qual o perfil do usuária - Marcelo Demichele?` passou a reconhecer a intenção apesar da concordância irregular, extrair o nome e consultar o perfil em modo somente leitura.

## Limite conhecido

O reconhecimento continua determinístico e baseado em vocabulário controlado. A bateria agora mede paráfrases reais dos fluxos críticos, mas novas formas linguísticas observadas em produção devem ser incorporadas como casos de regressão antes de ampliar o vocabulário do roteador.
