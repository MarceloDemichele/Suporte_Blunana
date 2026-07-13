# 05 - Catalogo de Dados e Formularios

## Formulários comprovados em código

| Tela/modulo | Campo | Tipo/seletores | Obrigatório | Validação | Origem | Destino | Evidência |
|---|---|---|---|---|---|---|---|
| Login | Usuário | `email`, `username`, `user`, `login`, `input[type=email]`, placeholders de email/usuário/login | Sim | Campo visível deve existir | `APP_USER` ou `BLUNANA_USERNAME` | UI de login | `crawler-interface/auth/login.ts` |
| Login | Senha | `password`, `senha`, `input[type=password]`, autocomplete/placeholder | Condicional no fluxo | Se visível, é preenchida e submetida | `APP_PASSWORD` ou `BLUNANA_PASSWORD` | UI de login | `crawler-interface/auth/login.ts` |
| Login/MFA | Código MFA | `one-time-code`, `otp`, `totp`, `mfa`, `code`, `codigo`, campos de dígito | Sim quando solicitado | Código gerado por `MFA_SECRET`; segredo vazio/inválido lança erro | `MFA_SECRET` | UI de MFA | `crawler-interface/auth/login.ts`, `crawler-interface/auth/mfa.ts` |

## Dados coletados pelo crawler

| Arquivo | Campos | Origem | Destino | Evidência |
|---|---|---|---|---|
| `outputs/json/blunana/dev/blunana-menu.json` | `texto`, `href`, `ariaLabel`, `title` | Elementos `a`, `button`, `[role='menuitem']` | Inventário de menu | `crawler-interface/collectors/menu.collector.ts` |
| `outputs/json/blunana/dev/blunana-telas.json` | `menu`, `url`, `titulo`, `h1`, `h2`, `screenshot`, `erro` | Navegação em `href`s únicos | Inventário de telas | `crawler-interface/collectors/screens.collector.ts` |

## Formulários inferidos pelos nomes das telas

Os itens abaixo são candidatos a formulários, mas os campos internos não foram comprovados pelo coletor atual. Devem permanecer como ponto a validar.

| Tela | Evidência | Status |
|---|---|---|
| Configuração de prazos | Rota `/custom/configuracao_de_prazo`, H1 `Configuração de prazos` | Ponto a validar |
| Configuração de publicações | Rota `/custom/configuracao_de_publicacoes`, H1 `Configuração de publicações` | Ponto a validar |
| Configuração de usuários | Rota `/custom/configuracao_usuario`, H1 `Configuração de usuários` | Ponto a validar |
| Configuração de Negociador | Rota `/custom/configuracao_de_negociador`, H2 `Configuração de Negociador` | Ponto a validar |
| Upload de imagem | Rota `/custom/teste_upload_de_imagem`, H2 `Upload de imagem` | Ponto a validar |
| Editar Prazo | Rota `/custom/editar_prazo` | Ponto a validar |
| Editar Audiencia | Rota `/custom/editar_audiencia` | Ponto a validar |

## Lacunas

- O coletor não extrai `input`, `select`, `textarea`, labels, obrigatoriedade, máscaras ou mensagens por campo das telas navegadas.
- Não há dump do DOM das telas, somente título, H1, H2 e screenshots em DEV.
- Não há catálogo de payloads das APIs internas do Blunana.
