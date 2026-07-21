# Prazos — memória funcional

Ambiente validado: HML
Rota: `/@rocha_juridico_hml/app/novos_prazos`

## Objetivo

Consultar e acompanhar prazos processuais por período, situação e responsável.

## Atalhos de período

- Hoje
- Amanhã
- Semana
- Mês
- Próxima semana 1, 2, 3 e 4
- Ver todas

## Filtros

- Status (a tela inicia com **Pendente**)
- Tipo de prazo
- Área
- Tipo de ação
- Responsável
- Código do cliente
- Número do processo
- Data do prazo: de/até
- Data fatal: de/até
- Data de tratamento: de/até

## Resultado e ações

A grade apresenta Status, Número do Processo, Área, Tipo de prazo, Nome da parte, Data do prazo, Data fatal, Advogado responsável, Descrição, Diário de bordo e Ação.

A tela permite **Limpar filtros** e **Exportar filtros para Excel**. Na listagem, o botão **Visualizar** abre o **Detalhe do processo**. Também foram identificadas as ações **Editar prazo**, **Histórico** e **Excluir prazo**; a exclusão exige confirmação.

## Limites da validação

- Nenhum prazo foi tratado ou alterado.
- Edição e histórico foram abertos com processo autorizado e fechados sem salvar.
- Regra complementar posterior esclareceu a permissão: qualquer usuário pode alterar Tipo de prazo, Advogado responsável e Data do prazo; Data fatal e Descrição exigem permissão específica na Configuração de Usuário, campo Alteração.
