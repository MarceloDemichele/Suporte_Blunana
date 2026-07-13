# Cliente - Resumo para Atendimento

## Resumo

O Robo CEF automatiza a busca de publicacoes no portal juridico da Caixa. Ele acessa o portal, pesquisa publicacoes no periodo configurado, separa 1a. e 2a. fase, identifica quais publicacoes ainda nao existem no banco, importa as novas e envia um resumo final.

## O que pode ser comunicado com seguranca

- O robo pesquisa publicacoes por periodo configurado.
- O robo processa 1a. fase e 2a. fase.
- O robo evita duplicidade por expediente.
- O robo registra logs de execucao.
- O robo envia resumo por Slack e WhatsApp.

## Informacoes que exigem validacao antes de comunicar

- Perfis/permissoes exigidos no portal CEF.
- Contrato das procedures de banco.
- Causa definitiva de falhas sem analisar logs e ambiente.
- Prazos de correcao ou disponibilidade de sistemas externos.

## Como explicar uma falha

Quando houver falha, informar que a causa deve ser validada entre os pontos comprovados de dependencia:

- portal CEF;
- credenciais/permissao;
- captcha;
- banco MySQL;
- procedures;
- Slack/WhatsApp;
- mudanca na estrutura da tela externa.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/suporte/perguntas-frequentes.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/*.cs`
- `Robo-CEF/Repositories/*.cs`
