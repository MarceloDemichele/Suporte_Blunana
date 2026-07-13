# Resposta ao Cliente - Empresa inativa e notificacoes de normativos

## Cliente

Nao informado

## Solicitacao recebida

"O usuario de empresa inativa ainda recebe notificacoes de normativos?"

## Classificacao

Duvida com indicio de possivel bug.

## Resposta sugerida

Ola.

No momento, nao temos base documental suficiente para confirmar que usuarios vinculados a empresas inativas devem ou nao receber notificacoes de normativos.

A documentacao consultada confirma que o projeto possui fluxo de notificacoes, mas nao confirma uma regra especifica para bloqueio de notificacoes por status da empresa. Tambem existe um chamado de teste registrado para investigar esse comportamento, indicando que a regra ainda precisa ser validada tecnicamente.

Por seguranca, recomendamos tratar esse caso como ponto de validacao tecnica. O time deve confirmar a regra de negocio esperada e verificar se a rotina de notificacao considera o status da empresa antes de enviar comunicacoes.

## Base consultada

- `.memory/contexto.md`
- `.memory/historico.md`
- `knowledge/arquitetura/visao-geral.md`
- `knowledge/backend/modulos.md`
- `knowledge/funcionalidades/publicacoes-cef.md`
- `knowledge/faq/operacional.md`
- `docs/robo-cef-regras-negocio.md`
- `docs/robo-cef-api.md`
- `docs/robo-cef-matriz-rastreabilidade.md`
- `docs/funcional/fluxos.md`
- `docs/suporte/perguntas-frequentes.md`
- `tickets/bugs/BUG-2026-07-06-empresa-inativa-notificacoes-normativos.md`

## Seguranca da resposta

Baixa

Motivo: a base consultada confirma a existencia de notificacoes, mas nao confirma regra de negocio sobre empresas inativas, usuarios vinculados a empresas inativas ou notificacoes de normativos por usuario.

## Proximo passo

Encaminhar para validacao tecnica e de negocio para confirmar:

1. Se usuarios de empresas inativas devem ser bloqueados no envio de notificacoes.
2. Onde o status da empresa e mantido.
3. Qual rotina seleciona destinatarios de normativos.
4. Se existe filtro por status da empresa antes do envio.

Caso seja confirmado que usuarios de empresas inativas nao devem receber notificacoes, o chamado de bug existente deve ser usado para investigacao e correcao.

