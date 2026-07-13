using System.Data;
using Dapper;
using MySql.Data.MySqlClient;
using Robo_CEF.Models;

namespace Robo_CEF.Repositories;

public class PublicacoesRepository(string connectionString)
{
    public async Task<(int Sucessos, int Erros)> ImportarPublicacoesAsync(List<PublicacoesTable> publicacoes, LogsRepository logsRepository)
    {
        using var conn = new MySqlConnection(connectionString);
        await conn.OpenAsync();

        int total = publicacoes.Count;
        int processados = 0;
        int sucessos = 0;
        int erros = 0;

        Console.WriteLine("Importando as novas publicações no banco...");

        var lotes = publicacoes.Chunk(100);

        foreach (var lote in lotes)
        {
            foreach (var item in lote)
            {
                try
                {
                    await conn.ExecuteAsync("EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760", item, commandType: CommandType.StoredProcedure);
                    sucessos++;
                }
                catch (Exception ex)
                {
                    erros++;
                    await logsRepository.LogErroProcessamentoAsync(
                        item.p_FASEPROCESSUAL ?? "FASE_NAO_INFORMADA",
                        item.p_EXPEDIENTE ?? "EXPEDIENTE_NAO_IDENTIFICADO",
                        ex.Message
                    );
                    Console.WriteLine($"[ERRO] Processo {item.p_EXPEDIENTE}: {ex.Message}");
                }
            }

            processados += lote.Length;
            int faltam = total - processados;

            Console.WriteLine($"Processados: {processados}/{total} | Faltam: {faltam}...");
        }

        Console.WriteLine($"Importação concluída! Sucessos: {sucessos} | Erros: {erros}");
        return (sucessos, erros);
    }

    public async Task<HashSet<string>> ObterExpedientesExistentesAsync(HashSet<string> expedientesEncontrados)
    {
        using var conn = new MySqlConnection(connectionString);
        var sql = """
        SELECT EXPEDIENTE
        FROM T_PROCESSOS_TERCEIRIZACAO_CEF
        WHERE EXPEDIENTE IN @Expedientes
        """;

        var result = await conn.QueryAsync<string>(sql, new { Expedientes = expedientesEncontrados });

        return result.ToHashSet();
    }
}