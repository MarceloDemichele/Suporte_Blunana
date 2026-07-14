# Resposta ao Cliente - Empresa inativa e notificações de normativos

## Cliente

Não informado.

## Solicitação recebida

"O usuário de empresa inativa ainda recebe notificações de normativos?"

## Classificação

Dúvida com indício de possível bug.

## Resposta sugerida

Olá.

No momento, não temos base documental suficiente para confirmar se usuários vinculados a empresas inativas devem ou não receber notificações de normativos.

A documentação consultada confirma que o projeto possui fluxo de notificações, mas não confirma uma regra específica para bloqueio por status da empresa. Também existe um chamado de teste registrado para investigar esse comportamento, indicando que a regra ainda precisa ser validada tecnicamente.

Por segurança, recomendamos tratar esse caso como ponto de validação técnica. O time deve confirmar a regra de negócio esperada e verificar se a rotina de notificação considera o status da empresa antes de enviar comunicações.

## Base consultada

- `.memory/historico.md`
- `knowledge/faq/operacional.md`
- `docs/regras-negocio/`
- `docs/fluxos/`
- `tickets/bugs/BUG-2026-07-06-empresa-inativa-notificacoes-normativos.md`

## Segurança da resposta

Baixa.

Motivo: a base consultada confirma a existência de notificações, mas não confirma regra de negócio sobre empresas inativas, usuários vinculados a empresas inativas ou notificações de normativos por usuário.

## Próximo passo

Encaminhar para validação técnica e de negócio para confirmar:

1. Se usuários de empresas inativas devem ser bloqueados no envio de notificações.
2. Onde o status da empresa é mantido.
3. Qual rotina seleciona destinatários de normativos.
4. Se existe filtro por status da empresa antes do envio.

Caso seja confirmado que usuários de empresas inativas não devem receber notificações, o chamado de bug existente deve ser usado para investigação e correção.

