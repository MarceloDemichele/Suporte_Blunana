# Bateria ampla de perguntas do agente

Data: 2026-07-15
Comando: `npm run test:battery`

## Cobertura

Total: **189 perguntas**.

| Categoria | Quantidade |
|---|---:|
| Regras canônicas | 64 |
| Regras contextualizadas | 64 |
| Consulta de telas — Como | 13 |
| Consulta de telas — Onde | 13 |
| Consulta de telas — Pesquisa | 13 |
| Procedimentos operacionais | 4 |
| Consulta dinâmica da plataforma | 8 |
| Perguntas ambíguas | 10 |

## Resultado

- 189 de 189 decisões validadas.
- Compilação TypeScript concluída.
- Regras gerais e específicas foram diferenciadas por confiança e especificidade.
- Consultas de tela foram separadas de perguntas normativas.
- Consultas sobre registros e usuários específicos foram direcionadas para a plataforma.

## Falhas encontradas e corrigidas

- Acesso autenticado ao Dashboard confundido com navegação.
- Formato do processo confundido com identificador único.
- Completude pós-importação confundida com encerramento/exclusão.
- WEBJUR e período do Portal CEF confundidos com consulta de Publicações.
- Vínculo do prazo criado pelo processo confundido com vínculo obrigatório geral.
- Regras específicas de Mutirão competindo entre si.
- `Onde crio um prazo?` não reconhecido como procedimento.

## Limitação operacional comprovada

O Playwright atualmente abre a aplicação e coleta título, URL e menus da página inicial. Ele ainda não executa consultas direcionadas em **Configuração Usuário** nem extrai o perfil de acesso de uma pessoa específica. Até essa navegação ser implementada, perguntas desse tipo são corretamente marcadas como dependentes da plataforma, mas exigem consulta manual.
