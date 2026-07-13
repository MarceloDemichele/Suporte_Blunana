using System.Text.Json.Serialization;

namespace Robo_CEF.Models;

public class PublicacoesTable
{
    [JsonPropertyName("Expediente")]
    public string? p_EXPEDIENTE { get; set; }

    [JsonPropertyName("Área Judicial")]
    public string? p_AREAJUDICIAL { get; set; }

    [JsonPropertyName("Situação CEF")]
    public string? p_SITUACAOCEF { get; set; }

    [JsonPropertyName("Data Fase")]
    public string? p_DATAFASE { get; set; }

    [JsonPropertyName("Descrição")]
    public string? p_DESCRICAO { get; set; }

    [JsonPropertyName("Fase Processual")]
    public string? p_FASEPROCESSUAL { get; set; }
}