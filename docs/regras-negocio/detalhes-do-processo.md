# Regras funcionais - Detalhes do Processo

## Objetivo

A tela `Detalhes do Processo` apresenta as informacoes de um processo individual.

## Como acessar

1. Acessar o menu `Processos`.
2. Localizar o processo desejado usando um ou mais filtros.
3. Acionar `Visualizar` no registro apresentado.
4. O sistema direciona para `Detalhes do Processo`.

## Regra de navegacao confirmada

- `Visualizar` parte da listagem de Processos.
- A acao direciona para a tela `Detalhes do Processo`.
- A documentacao desta tela deve permanecer separada das regras de consulta e filtragem.

## Seguranca para mapeamento

A tela pode conter dados processuais, pessoais ou de clientes. Uma futura coleta Playwright deve:

- usar apenas leitura;
- nao salvar valores de campos ou conteudo do processo;
- nao capturar screenshot;
- coletar somente rotulos, secoes, botoes, tipos de campos e permissoes aparentes;
- sanitizar qualquer texto antes de persistir evidencia.

## Pontos a validar

- secoes e campos apresentados;
- acoes disponiveis;
- existencia de edicao, anexos, historico ou movimentacoes;
- permissoes por perfil;
- mensagens e estados da tela;
- rota efetiva ao abrir um registro em PROD.

## Evidencia atual

- Fluxo `Processos > Visualizar > Detalhes do Processo` confirmado pela equipe de suporte em 2026-07-15.
- Nenhum registro real foi aberto durante esta atualizacao documental.
