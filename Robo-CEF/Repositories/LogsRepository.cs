using Dapper;
using MySql.Data.MySqlClient;
using Robo_CEF.Constants;

namespace Robo_CEF.Repositories;

public class LogsRepository(string connectionString)
{
    private const int RobotId = 178;

    public virtual async Task LogInicializacaoAsync()
    {
        var detalhes = "Robô iniciado";
        await InsertLogAsync(RobotExecutionState.Iniciando, detalhes);
        Console.WriteLine($"[LOG] {RobotExecutionState.Iniciando}: {detalhes}");
    }

    public virtual async Task LogEmProcessamentoAsync(int quantidadeItens)
    {
        var detalhes = $"Processando {quantidadeItens} item(ns)";
        await InsertLogAsync(RobotExecutionState.EmProcesso, detalhes);
        Console.WriteLine($"[LOG] {RobotExecutionState.EmProcesso}: {detalhes}");
    }

    public virtual async Task LogErroProcessamentoAsync(string faseProcessual, string expedicao, string mensagemErro)
    {
        var detalhes = $"Erro ao processar Fase: {faseProcessual}, expedição: {expedicao}, Erro: {mensagemErro}";
        await InsertLogAsync(RobotExecutionState.Erro, detalhes);
        Console.WriteLine($"[LOG] {RobotExecutionState.Erro}: {detalhes}");
    }

    public virtual async Task LogFinalizacaoAsync()
    {
        var detalhes = "Robô finalizado";
        await InsertLogAsync(RobotExecutionState.Finalizado, detalhes);
        Console.WriteLine($"[LOG] {RobotExecutionState.Finalizado}: {detalhes}");
    }

    private async Task InsertLogAsync(string status, string? detalhes = null)
    {
        using var conn = new MySqlConnection(connectionString);
        await conn.OpenAsync();

        var sql = """
            INSERT INTO EPM_ROCHA.T_EXECUCOES_ROBOTS (
                ROBOT_ID,
                STATUS,
                DETALHES,
                DATA_EXECUCAO,
                LAST_UPDATE
            )
            VALUES (
                @RobotId,
                @Status,
                @Detalhes,
                NOW(),
                NOW()
            )
        """;

        await conn.ExecuteAsync(sql, new
        {
            RobotId,
            Status = status,
            Detalhes = detalhes
        });
    }
}
