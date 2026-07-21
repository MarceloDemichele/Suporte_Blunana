# Memoria funcional aprofundada - Configuração do Prazo

Ambiente: HML

## Regra confirmada

No modal de inclusao, o Cliente ja vem predefinido pela tela. O usuario inicia o preenchimento pela Area do Cliente; o Cliente nao precisa ser selecionado novamente.

Rota: `/@rocha_juridico_hml/app/configuracao_de_prazo`

## Tela principal

### Filtros e campos

- Cliente
- Responsável
- Área do Cliente
- Tipo de Ação
- Tipo de Prazo
- Status

### Botoes funcionais

- Adicionar configuração

### Colunas

- Responsável
- Área do Cliente
- Tipo de Ação
- Tipo de Prazo
- Status
- Ações

## Modal - Adicionar configuração

### Campos

- Cliente
- Área do Cliente *
- Tipo de ação
- Tipo de prazo *
- Responsável *

### Botoes

- Cancelar
- Salvar

## Regras de seguranca da coleta

- Nenhum valor de tabela foi coletado.
- Nenhum formulario foi submetido.
- Nenhuma alteracao foi confirmada.
- Nenhuma screenshot foi capturada.

## Validacao de obrigatoriedade

- No formulario vazio, o botao Salvar permanece desabilitado.
- Nenhuma gravacao foi realizada no teste.

## Validacao com massa ficticia

- Cliente predefinido, Area do Cliente, Tipo de Acao, Tipo de Prazo e Responsavel formaram uma combinacao aceita pela tela.
- Apos o preenchimento, o botao Salvar ficou habilitado.
- O teste foi cancelado sem salvar.

## Validacao controlada de criacao e alteracao - 2026-07-15

- A tela confirmou a criacao de uma configuracao com Area do Cliente, Tipo de Acao, Tipo de Prazo e Responsavel.
- O registro de teste foi aberto pela acao de edicao e inativado ao final do ciclo.
- Ponto de atencao: o Responsavel exibido apos a gravacao nao correspondeu ao valor pretendido na selecao automatizada.
- Por seguranca, novas gravacoes automatizadas ficam suspensas ate que o seletor de Responsavel seja corrigido e revalidado.
- Nenhum registro preexistente foi alterado.

## Confirmacao manual complementar

- A equipe realizou uma inclusao manual e confirmou que o Responsavel selecionado foi gravado corretamente.
- A divergencia anterior ficou isolada na selecao automatizada, e nao na regra funcional da tela.
- O validador passou a conferir o valor efetivamente apresentado pelo campo apos cada selecao.
