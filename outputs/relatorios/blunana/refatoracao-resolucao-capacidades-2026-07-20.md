# Refatoração da resolução por capacidades — 2026-07-20

## Problema

O fallback local dependia de verbos específicos e o gerador de resposta reinterpretava a pergunta depois do roteador. Isso fazia formulações inéditas falharem mesmo quando a entidade e a capacidade já eram conhecidas.

## Mudanças

- Telas conhecidas são resolvidas por entidade e exclusão de rotas incompatíveis, sem exigir verbo de consulta cadastrado.
- Intenções de dado atual, procedimento e regra continuam com precedência sobre descrição de tela.
- Pergunta normativa sem regra comprovada não pode cair em orientação de tela.
- O gerador de resposta obedece à única interpretação produzida no início do fluxo; não aplica um segundo classificador textual.
- A resposta da Agenda passou a descrever o conteúdo funcional: calendário mensal com Prazos, Audiências e Tarefas.

## Matriz

Foram adicionadas quatro classes de descrição para cada uma das 13 telas:

- o que é demonstrado;
- quais informações aparecem;
- explique a tela;
- para que serve.

## Validação

- 300 perguntas aprovadas.
- 65 regras e 6 variações aprovadas.
- Interpretação local e semântica aprovadas.
- `git diff --check` sem erros.
- Pergunta `O que é demonstrado na tela de Agenda de Prazo?` validada pela API na porta 3333.

## Limite operacional

Sem `OPENAI_API_KEY`, perguntas fora das entidades e capacidades cadastradas continuam usando o fallback local. A camada por modelo já está implementada, mas somente será ativada após configuração da credencial no ambiente não versionado.
