using Dapper;
using MySql.Data.MySqlClient;
using System.Data;

namespace Robo_CEF.Repositories;

public class WhatsAppRepository(string connectionString)
{
    public async Task AdicionarMensagemAsync(string mensagem)
    {
        using var conn = new MySqlConnection(connectionString);
        await conn.OpenAsync();

        var query = "EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP";

        await conn.ExecuteAsync(
            query, 
            new { p_msg = mensagem }, 
            commandType: CommandType.StoredProcedure
        );
    }
}