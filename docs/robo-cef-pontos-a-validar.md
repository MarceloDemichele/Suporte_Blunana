# 10 - Pontos a Validar

| ID | Ponto | Motivo |
|---|---|---|
| PV-001 | Confirmar schema completo do banco MySQL | Repositorio nao contem DDL/migrations |
| PV-002 | Confirmar parametros esperados por `PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Fluxo ativo passa propriedades de `PublicacoesTable`, enquanto codigo legado usa `@p_FASE_PROCESSUAL`; procedure nao esta no repo |
| PV-003 | Confirmar parametros/efeitos de `PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | Procedure nao esta no repo |
| PV-004 | Confirmar se `Workers/*` ainda deve existir | Nao sao chamados pelo `Main` atual |
| PV-005 | Confirmar dependencias ausentes no `.csproj` | Codigo referencia `HtmlAgilityPack` e `Newtonsoft.Json` |
| PV-006 | Confirmar politica de armazenamento de segredos | Segredos existem em `config.json` e codigo |
| PV-007 | Confirmar ambiente de execucao esperado | Projeto mira `net8.0`, release `win-x64`, mas SDK nao esta instalado na maquina analisada |
| PV-008 | Confirmar se o portal permite/espera `ItemsPerPage` nos valores comentados | Comentarios em `config.json` listam 10, 50, 100, 300, 500 |
| PV-009 | Confirmar se a notificacao Slack deve ser obrigatoria para sucesso da execucao | Falha no webhook hoje gera excecao por `EnsureSuccessStatusCode` |
| PV-010 | Confirmar se o resumo deve ser enviado mesmo quando login/consulta falhar | Hoje esta no `finally` e inclui erro global |
| PV-011 | Confirmar regras de permissao no portal CEF | Codigo apenas autentica; permissoes do usuario nao estao no repositorio |
| PV-012 | Confirmar relacionamentos das tabelas citadas | Nao ha foreign keys ou diagrama no repositorio |
| PV-013 | Confirmar se publicacoes sem expediente devem ser importadas ou descartadas | Codigo nao consulta vazios no banco, mas pode manter uma publicacao sem expediente apos `DistinctBy` |
| PV-014 | Confirmar se falhas de Slack/WhatsApp devem ser isoladas para garantir log final e fechamento do driver | `finally` nao possui `try/catch` por etapa e pode ser interrompido por excecao de notificacao |
