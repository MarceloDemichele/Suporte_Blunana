# Arquitetura - Visao Geral

## Conhecimento

O Robo CEF e uma aplicacao console .NET 8. O fluxo e orquestrado de forma procedural em `Program.cs`, com instanciacao manual de repositories e services.

## Componentes

| Componente | Papel |
|---|---|
| `Program.cs` | Entrada da aplicacao e orquestracao do processamento |
| `Services` | Login, captcha, consulta de publicacoes e notificacoes |
| `Repositories` | Acesso ao MySQL, procedures e logs |
| `Models` | Estruturas de dados trafegadas no fluxo |
| `Constants` | Formatos de data, fases processuais e status |
| `Utils` | Conversao de tabela HTML em objetos |
| `Workers` | Implementacoes alternativas/legadas nao chamadas pelo `Main` atual |

## Fluxo arquitetural

1. Configuracao e lida de `config.json`.
2. Selenium cria uma sessao Chrome.
3. Services automatizam portal, captcha e notificacoes.
4. Repositories acessam MySQL.
5. O resumo final consolida os resultados de cada fase.

## Decisoes observadas

- Nao ha injecao formal de dependencia.
- Nao ha web server, controllers ou API propria comprovada.
- Nao ha camada de dominio isolada.
- A automacao depende diretamente de seletores do portal externo.

## Pontos a validar

- Confirmar destino dos `Workers`, pois parecem alternativos/legados.
- Confirmar se dependencias usadas no codigo legado devem permanecer.
- Confirmar build em ambiente limpo, pois o inventario apontou possiveis dependencias ausentes.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/tecnica/arquitetura.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Robo-CEF.csproj`
