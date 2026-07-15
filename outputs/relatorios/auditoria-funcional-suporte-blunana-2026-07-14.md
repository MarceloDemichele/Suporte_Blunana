# Auditoria funcional do Suporte Blunana

Data: 2026-07-14

## Conclusão executiva

O projeto é um protótipo funcional, não uma solução completa de atendimento. A API sobe na porta 3333, a busca local responde e há login/coleta por Playwright. Porém, a automação por PR não existe neste repositório, a fonte externa de documentação está desabilitada, o orquestrador é parcial e o Playwright não navega dinamicamente até a tela relacionada à pergunta.

## Informado x comprovado

| Item informado | Situação | Evidência/conclusão |
|---|---|---|
| Documentação atualizada após PR | Não comprovado | Não existe `.github/workflows`; scripts PowerShell são manuais; repositório de origem está desabilitado e usa URL de exemplo em `config/repositories.json` |
| Atualização de funções conforme telas | Parcial | Há inventários DEV de menu e 43 telas; não há sincronização automática ligada a PR nem comparação funcional detalhada |
| Playwright busca informação para responder | Parcial | Login, MFA e coleta de menu funcionam estruturalmente; provedor do assistente coleta somente título, URL e menu da página inicial |
| Agente interno orquestra a resposta | Parcial | Busca e resposta estão ligadas; planner e quatro engines estão vazios/não conectados; não há modelo de IA ou síntese geral de regras |
| Agente externo na porta 3333 chama o interno | Parcialmente comprovado | API respondeu em `/health`; `/assistant` chama diretamente busca/resposta e Playwright, sem uma fronteira real entre dois serviços/agentes |

## Riscos principais

1. Respostas erradas ou incompletas por busca textual simples.
2. Regras de negócio customizadas não estão documentadas com evidência suficiente.
3. Playwright não escolhe a rota, não abre a tela alvo e não executa pesquisa controlada.
4. Uso de credenciais/MFA reais sem gestão formal de segredos e auditoria.
5. Screenshots e evidências podem conter dados pessoais ou processuais.
6. Documentação DEV pode divergir de HML/PROD.
7. Não há suíte de testes automatizados; `npm test` apenas faz uma pergunta ao agente.
8. OpenAPI diverge das rotas realmente expostas.
9. Build TypeScript grava `.js` junto aos fontes e gera arquivos não rastreados.
10. Não há monitoramento, autenticação da API, limitação de acesso ou SLA técnico comprovado.

## Implementação necessária

### Prioridade 0 — definir e proteger

- Confirmar ambiente oficial para consulta: preferencialmente HML ou usuário PROD somente leitura.
- Definir quais dados podem ser coletados, armazenados e mostrados.
- Guardar credenciais/MFA em cofre seguro, nunca no Git.
- Definir respostas proibidas e quando encaminhar ao suporte humano.
- Escolher responsáveis por aprovar regras de negócio e respostas.

### Prioridade 1 — documentação confiável

- Configurar os repositórios reais em `config/repositories.json`.
- Criar workflow de PR para atualizar/validar documentação.
- Fazer o workflow falhar quando documentação gerada estiver desatualizada.
- Registrar commit, ambiente, data e fonte em cada atualização.
- Criar catálogo funcional por tela: objetivo, caminho de menu, campos, ações, mensagens, permissões e regras.
- Implantar revisão humana antes de publicar novas regras na base de suporte.

### Prioridade 2 — agente interno real

- Implementar orquestração: classificar pergunta, buscar conhecimento, medir confiança, decidir navegar e decidir escalar.
- Substituir busca textual simples por recuperação por trechos relevantes, com prioridade e rastreabilidade.
- Gerar resposta em linguagem de cliente, mantendo fontes e evidências separadas para auditoria.
- Nunca transformar inferência em fato; confiança baixa deve gerar validação humana.
- Implementar os engines hoje vazios ou remover a estrutura que induz a erro.

### Prioridade 3 — Playwright orientado à pergunta

- Mapear pergunta para módulo/tela/rota.
- Abrir a rota correta depois do login.
- Extrair labels, campos, botões, tabelas, mensagens e estados vazios.
- Permitir apenas ações de leitura por padrão.
- Sanitizar CPF, CNPJ, e-mail, nomes e dados de processos nas evidências.
- Salvar evidência com validade, ambiente, tela, horário e versão.
- Tratar expiração de sessão, MFA, mudança de seletor, timeout e indisponibilidade.

### Prioridade 4 — agente externo/API

- Definir contrato único para `/assistant` e alinhar OpenAPI.
- Proteger a API com autenticação e autorização.
- Separar resposta ao cliente de metadados internos.
- Adicionar identificador de atendimento, logs sanitizados, métricas e correlação.
- Definir timeout e fallback quando o agente interno ou o Blunana falhar.
- Decidir se “agente externo” e “interno” serão serviços separados ou apenas camadas do mesmo serviço.

### Prioridade 5 — qualidade e operação

- Criar conjunto de perguntas reais com respostas aprovadas pelo suporte.
- Testar perguntas conhecidas, desconhecidas, ambíguas e sensíveis.
- Criar testes de API, busca, confiança, segurança e Playwright.
- Medir taxa de resposta correta, escalonamento, tempo e fontes usadas.
- Criar processo de feedback: resposta corrigida vira conhecimento revisado.
- Preparar execução contínua com health check, reinício, logs e alertas.

## Critério mínimo para piloto

O piloto só deve responder diretamente ao cliente quando:

1. a pergunta estiver dentro de módulos previamente aprovados;
2. houver fonte documental ou evidência de tela válida;
3. a resposta não contiver dado sensível;
4. a confiança superar um limite definido pelo suporte;
5. perguntas não comprovadas forem encaminhadas a uma pessoa;
6. todas as respostas mantiverem rastreabilidade interna.

## Como a equipe de suporte pode ajudar

- Fornecer as 30 a 50 dúvidas mais frequentes.
- Escrever a resposta ideal, em linguagem de cliente, para cada pergunta.
- Informar o caminho real de menu e quais perfis enxergam cada opção.
- Listar variações de nomes usadas pelos clientes.
- Marcar quais dúvidas exigem consulta de tela e quais dependem de regra de negócio.
- Identificar dados que nunca podem aparecer em resposta ou evidência.
- Validar semanalmente respostas classificadas como duvidosas.

## Validações executadas

- `npm run build`: aprovado após os ajustes atuais.
- `npm run agent:ask -- "Como consulto um processo?"`: respondeu de forma curta usando o menu comprovado.
- Servidor local: iniciou na porta 3333 e `GET /health` retornou status `ok`.
- Porta 3333 foi encerrada após o teste.
- Não foi executada navegação real no Blunana nesta auditoria.

## Fontes

- `package.json`
- `config/repositories.json`
- `scripts/generateDocs.ps1`
- `external-agent/api/server.ts`
- `external-agent/api/controllers/assistant.controller.ts`
- `external-agent/core/search.ts`
- `external-agent/core/answer.ts`
- `external-agent/core/planner.ts`
- `external-agent/engine/*.ts`
- `external-agent/providers/playwright.provider.ts`
- `crawler-interface/auth/login.ts`
- `crawler-interface/collectors/menu.collector.ts`
- `crawler-interface/collectors/screens.collector.ts`
- `external-agent/api/openapi/openapi.yaml`
- `outputs/json/blunana/dev/blunana-menu.json`
- `outputs/json/blunana/dev/blunana-telas.json`
