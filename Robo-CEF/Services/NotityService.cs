using System.Text;
using System.Text.Json;
using Robo_CEF.Repositories;

namespace Robo_CEF.Services;

public class NotifyService(WhatsAppRepository whatsAppRepository)
{
    public async Task NotificarSlackAsync(string mensagem)
    {
        using var httpClient = new HttpClient();

        var payload = new { text = mensagem };
        var jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var slackWebhookUrl = "";

        var response = await httpClient.PostAsync(slackWebhookUrl, content);

        response.EnsureSuccessStatusCode();

        Console.WriteLine("Notificação do Slack enviada com sucesso");
    }

    public async Task NotificarWhatsAppAsync(string mensagem)
    {
        await whatsAppRepository.AdicionarMensagemAsync(mensagem);
        Console.WriteLine("Notificação do WhatApp enviada com sucesso");
    }
}