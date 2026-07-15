# Changelog

## 2026-07-14

- Em 2026-07-15, regra esclarecida para Configuracao de Publicacao e de Processos: Area do Cliente e Responsavel obrigatorios; Tipo de Acao opcional.
- Em 2026-07-15, massa ficticia preencheu sem gravacao Tipo de Ateste, Usuario, Configuracao do Prazo e Processo; seletor Playwright da Area em Publicacao e Configuracao de Processos ficou pendente.
- Em 2026-07-15, sete formularios HML tiveram bloqueios de obrigatoriedade validados sem gravacao: quatro desabilitam Salvar e tres mantem o modal aberto apos validacao.
- Em 2026-07-15, pre-teste da massa HML aprovado em todos os campos, sem submissao; massa liberada para proxima fase controlada.
- Em 2026-07-15, confirmado que Cliente em Configuracao do Prazo e predefinido; validador deixou de tentar selecionar esse campo.
- Em 2026-07-15, pre-teste da massa HML confirmou descritores de prazo, papel, area de ateste, cliente de usuario, area e tipo de acao; gravacao segue bloqueada por seletores dependentes da Configuracao do Prazo.
- Em 2026-07-15, massa ficticia HML e plano de limpeza foram definidos; gravacoes permanecem bloqueadas por allowlist vazia de cliente, areas, tipos e responsavel.
- Em 2026-07-15, 13 memorias HML foram aprofundadas em 17 secoes/abas e 7 modais, sem submissao ou persistencia de dados pessoais.
- Em 2026-07-15, mapeamento autonomo HML concluiu 13/13 telas, criou 13 memorias e detectou 6 modais sem submeter alteracoes.
- Em 2026-07-15, escopo esclarecido como os grupos laterais `Configuracoes` e `Menu`, totalizando 13 submenus equivalentes em PROD e HML; Processos e demais itens listados voltaram ao escopo.
- Em 2026-07-15, menu HML coletado e comparado com PROD: 5 configuracoes comuns e 2 configuracoes de PROD ausentes em HML.
- Em 2026-07-15, escopo de PROD/HML limitado a Configuracoes e Menu; modulos restantes foram marcados como em desenvolvimento e bloqueados para resposta oficial.
- Em 2026-07-15, login HML validado com sucesso no tenant `@rocha_juridico_hml`, sem screenshot ou navegacao adicional.
- Em 2026-07-15, HML foi separado como ambiente de exploracao controlada; respostas ao cliente continuam exigindo confirmacao final em PROD.
- Em 2026-07-15, acoes `Adicionar Processo` e `Visualizar` foram documentadas; memoria de `Detalhes do Processo` foi separada em arquivo proprio.
- Em 2026-07-15, equipe de suporte confirmou que os filtros de Processos sao automaticos e cumulativos; regra e resposta do agente foram atualizadas.
- Em 2026-07-15, tela Processos PROD mapeada em modo somente leitura; filtros e estrutura de resultados passaram a fundamentar a resposta do agente.
- Em 2026-07-15, menu PROD coletado com 25 elementos e 19 rotas unicas, sem screenshots, e usado com sucesso na resposta sobre Processos.
- Em 2026-07-15, URL de login PROD corrigida de `/@rocha_juridico/studio/auth/login` para `/@rocha_juridico/auth/login` no exemplo oficial.
- Preparado acesso PROD com `.env.prod`, exemplo seguro, comando `login:prod`, validacao obrigatoria de configuracao e teste sem screenshot.
- Corrigido carregamento assincrono da biblioteca MFA para compatibilidade com a execucao atual.
- Em 2026-07-15, login PROD validado ate `StartOtpLogin` (HTTP 200); conclusao MFA retornou HTTP 403 e ficou pendente de validacao do segredo associado ao usuario.
- Definido PROD como unico ambiente permitido para consultas do suporte; DEV/HML foram bloqueados como fonte de resposta operacional.
- Ajustada a resposta do agente para apresentar orientação curta ao usuário, sem despejar documentos técnicos.
- Busca passou a ignorar palavras genéricas e priorizar inventários de menus e telas.
- CLI e API passaram a usar Playwright quando a base local não comprova uma orientação operacional e a navegação está autorizada.

## 2026-07-13

- Reorganizado o projeto para o fluxo de suporte Blunana.
- Removido o escopo ativo ligado ao contexto antigo de automação.
- Consolidado o agente externo e o agente interno para análise de documentação, navegação e atualização documental.
- Mantido o foco em docs, engineering-reversa, support e outputs como base de contexto.
