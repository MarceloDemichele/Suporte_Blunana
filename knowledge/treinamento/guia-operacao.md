# Treinamento - Guia Inicial

## Publico

Operacao, suporte, QA, desenvolvimento e atendimento.

## Conceitos principais

- O Robo CEF e uma aplicacao console.
- A fonte das publicacoes e o portal juridico CEF.
- O login depende de usuario, senha e captcha.
- O periodo e configurado por `DiasRetroativos`.
- A deduplicacao usa expediente.
- A importacao ocorre por procedure no MySQL.
- O resumo final e enviado por Slack e WhatsApp.

## Fluxo para memorizar

1. Configurar.
2. Logar.
3. Pesquisar 1a. fase.
4. Importar novas publicacoes de 1a. fase.
5. Pesquisar 2a. fase.
6. Importar novas publicacoes de 2a. fase.
7. Notificar.
8. Registrar finalizacao.

## Checklist de suporte

1. Confirmar se `config.json` esta disponivel no ambiente.
2. Confirmar acesso ao portal CEF.
3. Confirmar resolucao de captcha.
4. Confirmar conexao com MySQL.
5. Confirmar procedures.
6. Confirmar Slack e WhatsApp.
7. Conferir resumo final e logs.

## Cenarios de treinamento sugeridos

- Explicar como o robo calcula periodo.
- Explicar como evita duplicidade.
- Simular publicacao ja existente.
- Simular falha de login.
- Simular falha de importacao de um item.
- Simular falha de notificacao.

## Pontos a validar

- Nao ha testes automatizados encontrados no repositorio.
- Nao ha documentacao de permissoes do portal externo.
- Nao ha schema completo do banco no repo.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/qa/cenarios-teste.md`
- `docs/funcional/fluxos.md`
- `docs/funcional/modulos.md`
