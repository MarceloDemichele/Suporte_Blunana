using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Robo_CEF.MySqlDatabase
{
    internal class MySqlDatabase
    {
        public static void InsertProcessesByProcedure(Models.TableDataModel model, string faseProcessual)
        {
            var configBuilder = new ConfigurationBuilder()
                .AddJsonFile("config.json", optional: true, reloadOnChange: true);
            var configuration = configBuilder.Build();
            var config = configuration["ConnectionStrings:DefaultConnection"];

            try
            {
                using (var con = new MySqlConnection(config))
                {
                    con.Open();
                    using (var cmd = con.CreateCommand())
                    {
                        cmd.CommandText = "CALL PRC_PUBLICACOES_PORTAL_CEF_MER_760(@p_EXPEDIENTE, @p_AREAJUDICIAL, @p_SITUACAOCEF, @p_DATAFASE, @p_DESCRICAO, @p_FASE_PROCESSUAL);";

                        cmd.Parameters.AddWithValue("@p_EXPEDIENTE", model.expediente ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@p_AREAJUDICIAL", model.area_judicial ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@p_SITUACAOCEF", model.situacao_cef ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@p_DATAFASE", model.data_fase);
                        cmd.Parameters.AddWithValue("@p_DESCRICAO", model.descricao ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@p_FASE_PROCESSUAL", faseProcessual ?? (object)DBNull.Value);

                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing procedure: {ex.Message}");
                throw;
            }
        }
    }
}
