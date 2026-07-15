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
