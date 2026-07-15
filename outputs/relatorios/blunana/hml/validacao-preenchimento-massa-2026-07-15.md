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
| Configuracao de Publicacao | Regra confirmada: Area do Cliente e Responsavel obrigatorios; Tipo de Acao opcional |
| Configuracao de Processos | Regra confirmada: Area do Cliente e Responsavel obrigatorios; Tipo de Acao opcional |

## Regra corrigida

- Em ambas as configuracoes, Area do Cliente e Responsavel devem ser selecionados para habilitar Salvar.
- Tipo de Acao e opcional.
- A Area pode aparecer preenchida inicialmente, mas a selecao e necessaria para validar o formulario.
- O Playwright ainda identifica o componente interno da Area como desabilitado; trata-se de uma pendencia do seletor da automacao, nao de uma divergencia da regra funcional.

## Seguranca

- O Playwright nao clicou em Salvar.
- Todos os modais foram cancelados.
- Nenhum dado foi criado, alterado ou excluido.
- Os valores ficticios preenchidos nao foram gravados no relatorio estruturado.
- Evidencia: `outputs/json/blunana/hml/validacao-preenchimento-massa.json`.
