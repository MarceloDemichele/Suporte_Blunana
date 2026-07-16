# Regras funcionais - Processos

## Consulta e filtros

Na tela `Processos`, a filtragem ocorre automaticamente quando o usuario seleciona ou informa um filtro. Nao existe necessidade de acionar um botao de pesquisa.

Quando mais de um filtro e utilizado, cada novo filtro acrescenta um criterio a consulta. Portanto, os filtros sao combinados de forma cumulativa para restringir o resultado.

Exemplo funcional:

1. Informar o status reduz a lista aos processos daquele status.
2. Informar tambem o responsavel mantem o status e acrescenta o responsavel como criterio.
3. Utilizar `Limpar filtros` remove os criterios aplicados.

## Encerramento e exclusao

Nenhum processo e excluido ou apagado da plataforma. Quando um processo nao deve mais permanecer ativo, sua situacao pode ser alterada para **Encerrado**, mas o registro continua armazenado e pode ser consultado no sistema.

Para respostas de suporte, nao orientar o usuario a excluir ou deletar processos. A orientacao correta e alterar a situacao para **Encerrado**.

## Responsavel obrigatorio

Todo processo deve possuir pelo menos um **Responsavel** vinculado. Um processo nao deve permanecer sem responsavel.

## Acoes da tela

### Adicionar Processo

O botao `Adicionar Processo` abre um modal para inclusao manual dos dados de um processo.

Esta e uma acao transacional. O agente de suporte pode explicar onde ela fica e qual e sua finalidade, mas o Playwright nao deve preencher nem confirmar a inclusao de um processo em PROD durante coleta de evidencia.

Pontos a mapear posteriormente, sem salvar dados reais:

- campos exibidos no modal;
- campos obrigatorios;
- validacoes e mensagens;
- botoes de confirmar e cancelar;
- perfis autorizados a incluir processos.

### Visualizar

A acao `Visualizar`, disponivel para um processo apresentado na listagem, direciona o usuario para a tela `Detalhes do Processo`.

O comportamento interno dessa tela deve ser mantido separadamente em [`detalhes-do-processo.md`](detalhes-do-processo.md), evitando misturar as regras da consulta com as regras do registro individual.

## Evidencias

- Confirmacao funcional fornecida pela equipe de suporte em 2026-07-15.
- Finalidade das acoes `Adicionar Processo` e `Visualizar` confirmada pela equipe de suporte em 2026-07-15.
- Regra de que processos nunca sao excluidos e somente podem ser encerrados confirmada pela equipe de suporte em 2026-07-15.
- Obrigatoriedade de pelo menos um Responsavel por processo registrada na `RN-024` do documento de regras de negocio.
- Filtros e controle `Limpar filtros` observados em `outputs/json/blunana/prod/processos-tela.json`.
- Rota PROD: `/@rocha_juridico/app/processos1`.

## Ponto a validar

- Tempo de atualizacao da listagem e comportamento em caso de nenhum resultado ainda nao foram medidos pelo Playwright.
- Campos e validacoes do modal `Adicionar Processo` ainda nao foram mapeados.
