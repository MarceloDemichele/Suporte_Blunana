# Mapeamento do menu operacional — HML

Data: 2026-07-15

## Resultado

Oito telas do grupo **Menu** foram percorridas em HML e documentadas:

1. Home
2. Agenda de prazos
3. Processos
4. Publicações
5. Prazos
6. Audiência
7. Audiência Mutirão
8. Ateste

Foram verificados indicadores, filtros, colunas, botões, modais seguros e dependências visíveis. Os fluxos de upload foram abertos somente até a prévia, sem arquivos e sem importação.

## Cobertura concluída

- Processos: consulta, filtros cumulativos, exportação e inclusão manual.
- Publicações: consulta, filtros, exportação e possíveis duplicidades.
- Prazos: atalhos de período, filtros, exportação e estrutura da grade.
- Audiência: atalhos de período, filtros, exportação e estrutura da grade.
- Audiência Mutirão: consulta, ações identificadas e modal de upload.
- Ateste: indicadores, consulta, ações identificadas e modal de upload de pagamento.
- Home e Agenda de prazos: já aprofundadas em memória própria.

## Pontos que ainda exigem massa fictícia

- Detalhar as ações individuais das linhas de Prazos e Audiência.
- Completar a navegação de **Visualizar e tratar processo** e aprofundar Detalhes do Processo.
- Testar importações com arquivos fictícios válidos, incluindo mensagens de sucesso e rejeição.
- Validar edição e tratamento somente sobre registros fictícios identificáveis e removíveis.

## Segurança aplicada

- Nenhum registro real foi criado, alterado, tratado, importado ou excluído.
- Nenhum dado pessoal, número de processo ou valor financeiro real foi persistido nas memórias.
- Ações destrutivas não foram executadas.
