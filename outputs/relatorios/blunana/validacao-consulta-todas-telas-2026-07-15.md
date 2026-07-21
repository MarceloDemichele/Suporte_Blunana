# Validação de consulta das telas — porta 3333

Data: 2026-07-15
Pergunta-base: `Como faço para consultar <tela>?`
Escopo: cinco telas de Configurações e oito telas do Menu.

## Resultado geral

- Corretas: 3 de 13.
- Incompletas: 3 de 13.
- Incorretas: 7 de 13.

## Avaliação por tela

| Tela solicitada | Avaliação | Problema ou resultado |
|---|---|---|
| Configuração do Ateste | Incorreta | Direcionou para Ateste operacional. |
| Configuração Usuário | Incompleta | Identificou o menu, mas não explicou abas e filtros. |
| Configuração de Publicação | Incorreta | Direcionou para Publicações operacional. |
| Configuração do Prazo | Incorreta | Direcionou para Prazos operacional. |
| Configuração de Processos | Incorreta | Direcionou para Processos operacional. |
| Home | Incorreta | Informou ausência de comprovação apesar de existir memória detalhada. |
| Agenda de prazos | Incorreta | Direcionou para Prazos operacional. |
| Processos | Correta | Informou filtros cumulativos e atualização automática. |
| Publicações | Correta | Informou filtros, status inicial Pendente e atualização automática. |
| Prazos | Incompleta | Orientação válida, mas não apresentou os filtros disponíveis. |
| Audiência | Incompleta | Orientação válida, mas não apresentou os filtros disponíveis. |
| Audiência Mutirão | Incorreta | Direcionou para Audiência comum. |
| Ateste | Correta | Apresentou os filtros e a abertura do lançamento. |

## Causa técnica

O agente ainda resolve parte das consultas pelo termo funcional dominante. Com isso, nomes compostos e telas com nomes semelhantes perdem especificidade:

- Configuração de Publicação → Publicações;
- Configuração do Prazo → Prazos;
- Configuração de Processos → Processos;
- Agenda de prazos → Prazos;
- Audiência Mutirão → Audiência.

A palavra `configuração` também é removida durante a identificação do assunto, impedindo a distinção entre a tela configuradora e a operacional.

## Correção necessária

1. Resolver primeiro o nome completo ou alias da tela solicitada.
2. Dar prioridade ao nome mais específico: `Audiência Mutirão` antes de `Audiência`.
3. Manter `Configuração` como parte do identificador da tela.
4. Associar a cada tela uma resposta própria de consulta, baseada em sua memória funcional.
5. Criar regressão com as 13 perguntas deste relatório.

## Reteste após correção

Após a criação do catálogo estruturado de telas e da resolução pela primeira tela mencionada, as 13 perguntas foram repetidas na porta 3333.

- Corretas: 13 de 13.
- Incompletas: 0 de 13.
- Incorretas: 0 de 13.

Foram confirmadas as distinções entre:

- Configuração do Ateste e Ateste;
- Configuração de Publicação e Publicações;
- Configuração do Prazo e Prazos;
- Configuração de Processos e Processos;
- Agenda de prazos e Prazos;
- Audiência Mutirão e Audiência.

Também foi validada a pergunta com qualificador secundário `Como consultar um ateste pelo número do processo?`: o agente manteve Ateste como tela principal, sem confundir com Processos.
