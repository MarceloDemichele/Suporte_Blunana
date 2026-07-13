using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using HtmlAgilityPack;

namespace Robo_CEF.Utils;

public static class HtmlTableParser
{
    public static readonly JsonSerializerOptions jsonOptionsDefault = new() 
    {
        PropertyNameCaseInsensitive = true,
        NumberHandling = JsonNumberHandling.AllowReadingFromString,
        WriteIndented = true
    };

    public static List<Dictionary<string, object?>> HtmlToDictionary(string htmlContent)
    {
        var result = new List<Dictionary<string, object?>>();
        
        if (string.IsNullOrWhiteSpace(htmlContent)) return result;

        var doc = new HtmlDocument();
        doc.LoadHtml(htmlContent);

        var table = doc.DocumentNode.SelectSingleNode("//table");
        if (table == null) return result;

        var rows = table.SelectNodes(".//tr");
        if (rows == null || rows.Count < 2) return result;

        var headers = rows[0].SelectNodes("th|td");
        if (headers == null) return result;

        var headerList = headers
            .Select(h => LimparTextoHtml(h) ?? "coluna_sem_nome")
            .ToList();

        foreach (var row in rows.Skip(1))
        {
            var cells = row.SelectNodes("td");
            if (cells == null) continue;

            var rowDict = new Dictionary<string, object?>();

            for (int i = 0; i < cells.Count && i < headerList.Count; i++)
            {
                string key = headerList[i];
                
                if (string.IsNullOrWhiteSpace(key) || key == "coluna_sem_nome") continue;
                rowDict[key] = LimparTextoHtml(cells[i]);
            }
            
            if (rowDict.Values.Any(v => v != null)) 
                result.Add(rowDict);
        }

        return result;
    }

    public static List<T> ConvertToClass<T>(List<Dictionary<string, object?>> dictList)
    {
        string json = JsonSerializer.Serialize(dictList);
        return JsonSerializer.Deserialize<List<T>>(json, jsonOptionsDefault) ?? [];
    }

    public static List<T> Parse<T>(string html)
    {
        var dicts = HtmlToDictionary(html);
        return ConvertToClass<T>(dicts);
    }

    private static string? LimparTextoHtml(HtmlNode? node)
    {
        if (node == null) return null;

        var breaks = node.SelectNodes(".//br");
        if (breaks != null)
        {
            foreach (var br in breaks)
            {
                br.ParentNode?.ReplaceChild(HtmlNode.CreateNode(" "), br);
            }
        }

        string text = WebUtility.HtmlDecode(node.InnerText)
            .Replace("\t", "")
            .Replace("\r", "")
            .Replace("\n", "")
            .Trim();

        return string.IsNullOrEmpty(text) ? null : text;
    }
}