# Acesso Externo ao Blunana

## Objetivo
Validar o acesso externo ao Blunana e mapear telas, fluxos e regras aparentes da aplicação.

## Antes de executar
Validar se existem as variáveis de ambiente necessárias:

- BLUNANA_BASE_URL
- BLUNANA_LOGIN_URL
- BLUNANA_USERNAME
- BLUNANA_PASSWORD

## Regras de segurança
- Não exibir credenciais.
- Não salvar prints com dados sensíveis.
- Não alterar dados da aplicação.
- Não criar, editar ou excluir registros reais.
- Usar somente navegação controlada.
- Mascarar nomes, e-mails, documentos e qualquer dado real.

## Fluxo
1. Acessar BLUNANA_LOGIN_URL.
2. Validar se a tela de login carrega.
3. Realizar autenticação com usuário autorizado.
4. Caso exista 2FA, solicitar intervenção humana ou usar configuração autorizada.
5. Mapear menu principal.
6. Mapear telas acessíveis.
7. Registrar rotas, nomes de telas e ações disponíveis.
8. Gerar inventário no ambiente correspondente, por exemplo `/outputs/relatorios/blunana/dev/blunana-inventario.md` em DEV.
9. Atualizar `/knowledge/frontend/rotas-blunana.md`.
10. Atualizar `/docs/funcional/mapa-navegacao-blunana.md`.

## Saída obrigatória
Gerar:

- outputs/{tipo}/blunana/{ambiente}/blunana-inventario.md
- knowledge/frontend/rotas-blunana.md
- docs/funcional/mapa-navegacao-blunana.md
