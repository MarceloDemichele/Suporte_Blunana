# Validacao de criacao e alteracao das configuracoes - HML

Data: 2026-07-15

## Resultado executivo

Foram executados ciclos controlados de criacao, consulta, edicao e inativacao. Todos os registros criados durante o teste foram deixados inativos. Nenhum registro preexistente foi alterado.

| Configuracao | Resultado | Situacao final |
| --- | --- | --- |
| Tipo de Ateste | Criacao, alteracao de nome e inativacao confirmadas | Registro ficticio inativo |
| Publicacao | Criacao, edicao e inativacao confirmadas | Registro ficticio inativo |
| Processos | Criacao, edicao e inativacao confirmadas | Registro ficticio inativo |
| Prazo | Criacao e inativacao confirmadas; inclusao manual confirmou o Responsavel correto | Registro automatizado ficticio inativo |
| Usuario | Criacao, edicao e inativacao confirmadas | Usuario ficticio inativo |
| Regra de Ateste | Criacao, alteracao de valor e inativacao confirmadas | Regra e tipo auxiliar inativos |
| Vinculo de Usuario | Criacao, edicao e inativacao confirmadas | Vinculo e usuarios ficticios inativos |
| Excecao de Ateste | Criacao, edicao e inativacao confirmadas | Excecao e usuario ficticio inativos |

## Evidencias funcionais

- Publicacao recusou uma combinacao duplicada e indicou unicidade por Cliente, Area do Cliente e Tipo de Acao.
- Processos aceitou uma combinacao ficticia distinta e permitiu sua inativacao.
- Prazo exibiu, depois da gravacao, um Responsavel diferente do valor pretendido na automacao.
- O registro divergente de Prazo foi imediatamente inativado e confirmado na tabela.
- Uma inclusao manual posterior confirmou que a tela grava corretamente o Responsavel selecionado.
- Usuario foi criado sem permissoes adicionais e inativado; a equipe confirmou que a inclusao nao envia e-mail nem SMS.
- Regra de Ateste nasce ativa, aceita valor monetario e permite alteracao e inativacao.
- Vinculo exige Superior e Subordinado e permite controlar o status ativo.
- Excecao de Ateste relaciona um usuario a uma Area Juridica e permite controlar o status ativo.
- O campo Advogado da Excecao permite selecionar qualquer advogado disponivel, sem regra adicional de selecao, conforme confirmacao funcional da equipe.

## Tratamento da divergencia de Prazo

O comportamento correto da tela foi confirmado manualmente. O validador automatizado foi reforcado para comparar o valor apresentado pelo campo com a opcao escolhida, impedindo que uma divergencia seja considerada sucesso.

## Proxima validacao recomendada

1. Reexecutar o pre-teste automatizado de Prazo com a nova verificacao do valor selecionado.
2. Manter a inativacao dos dados ficticios ao final de futuros testes.
3. Manter a regra de selecao livre de advogados sincronizada com futuras alteracoes do produto.
