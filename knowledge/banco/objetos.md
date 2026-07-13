# Banco de Dados - Objetos Conhecidos

## Conhecimento

O projeto usa MySQL para consultar publicacoes existentes, importar novas publicacoes, registrar logs de execucao e enviar mensagem WhatsApp por procedure.

## Objetos citados no codigo

| Objeto | Tipo | Finalidade | Origem |
|---|---|---|---|
| `T_PROCESSOS_TERCEIRIZACAO_CEF` | Tabela | Consultar expedientes ja existentes | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| `EPM_ROCHA.T_EXECUCOES_ROBOTS` | Tabela | Registrar logs de execucao | `Robo-CEF/Repositories/LogsRepository.cs` |
| `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Stored procedure | Importar publicacoes novas | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | Stored procedure | Inserir mensagem WhatsApp | `Robo-CEF/Repositories/WhatsAppRepository.cs` |
| `PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Stored procedure sem schema no legado | Insercao no fluxo legado | `Robo-CEF/MySqlDatabase/MySqlDatabase.cs` |

## Dados de publicacao

Campos extraidos para publicacao:

- Expediente.
- Area Judicial.
- Situacao CEF.
- Data Fase.
- Descricao.
- Fase Processual.

Origem: `Robo-CEF/Models/PublicacoesTable.cs`.

## Regras associadas

- Expediente e usado para deduplicacao.
- Expedientes vazios nao entram na consulta de existentes.
- Publicacoes novas sao importadas em lotes de 100.
- Erro por item gera log e nao interrompe o processamento completo.

## Pontos a validar

- Nao ha DDL, migrations ou schema completo no repositorio.
- Contratos das procedures dependem do banco externo.
- Confirmar se a procedure aceita os parametros do fluxo ativo e do fluxo legado.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/tecnica/configuracoes.md`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`
- `Robo-CEF/Repositories/LogsRepository.cs`
- `Robo-CEF/Repositories/WhatsAppRepository.cs`
- `Robo-CEF/MySqlDatabase/MySqlDatabase.cs`
