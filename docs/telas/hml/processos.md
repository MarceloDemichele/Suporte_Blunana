# Memoria funcional aprofundada - Processos

Ambiente: HML

Rota: `/@rocha_juridico_hml/app/processos1`

## Tela principal

### Filtros e campos

- Situação
- Status
- Área
- Tipo de acao
- Responsavel
- Codigo do cliente
- Extinto
- Numero do processo
- Data de recebimento (de)
- Data de recebimento (ate)
- Data tratado (de)
- Data tratado (ate)

### Botoes funcionais

- Adicionar Processo
- Limpar filtros

### Colunas

- Stituação
- Status
- Numero do processo
- Area
- Tipo de acao
- Responsavel
- Data recebimento
- Data tratado
- Acao

## Modal - Adicionar Processo

### Campos

- Codigo do Cliente *
- Codigo Terceirizacao
- Numero do Processo *
- Comarca
- Foro
- Vara
- Area *
- Tipo de Acao *
- Nome da Parte
- CPF - CNPJ

### Botoes

- Cancelar
- Salvar

## Regras de seguranca da coleta

- Nenhum valor de tabela foi coletado.
- Nenhum formulario foi submetido.
- Nenhuma alteracao foi confirmada.
- Nenhuma screenshot foi capturada.

## Validacao de obrigatoriedade

- O botao Salvar fica habilitado com o formulario vazio, mas o modal permanece aberto apos o clique.
- A tela exige Codigo do Cliente, Numero do Processo, Area e Tipo de Acao.
- Nenhuma gravacao foi realizada no teste.

## Validacao com massa ficticia

- Codigo do Cliente e Numero do Processo aceitaram os formatos ficticios definidos.
- Area e Tipo de Acao foram selecionados com sucesso.
- Apos o preenchimento dos obrigatorios, o botao Salvar ficou habilitado.
- O teste foi cancelado sem salvar.
