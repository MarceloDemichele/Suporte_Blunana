# Validacao de preenchimento com massa ficticia em HML

Data: 2026-07-15

## Resultado comprovado

| Formulario | Resultado |
|---|---|
| Tipo de Ateste | Nome aceito; formulario habilitado |
| Regra de Ateste | Area de Ateste selecionada |
| Usuario | Cliente, Nome, Email e Papel aceitos; formulario habilitado |
| Configuracao do Prazo | Combinacao completa aceita; formulario habilitado |
| Processo | Obrigatorios preenchidos; formulario habilitado |
| Configuracao de Publicacao | Area do Cliente + Responsavel habilitaram Salvar; Tipo de Acao permaneceu vazio |
| Configuracao de Processos | Area do Cliente + Responsavel habilitaram Salvar; Tipo de Acao permaneceu vazio |

## Regra corrigida

- Em ambas as configuracoes, Area do Cliente e Responsavel devem ser selecionados para habilitar Salvar.
- Tipo de Acao e opcional.
- A Area pode aparecer preenchida inicialmente, mas a selecao e necessaria para validar o formulario.
- O navegador confirmou que o campo fica habilitado apos o carregamento do modal; o validador foi ajustado para aguardar esse estado.
- Os dois modais foram cancelados sem clicar em Salvar.

## Seguranca

- O Playwright nao clicou em Salvar.
- Todos os modais foram cancelados.
- Nenhum dado foi criado, alterado ou excluido.
- Os valores ficticios preenchidos nao foram gravados no relatorio estruturado.
- Evidencia: `outputs/json/blunana/hml/validacao-preenchimento-massa.json`.
