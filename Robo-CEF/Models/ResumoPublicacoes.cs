namespace Robo_CEF.Models;

public struct ResumoExtracao
{
    public int TotalPortal { get; set; }
    public int TotalEncontrado { get; set; }
    public int TotalNaoDuplicado { get; set; }
    public int TotalExistente { get; set; }
    public int TotalNovos { get; set; }
    public int TotalSucesso { get; set; }
    public int TotalErros { get; set; }
}