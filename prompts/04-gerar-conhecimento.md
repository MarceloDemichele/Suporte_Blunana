# Geração da Base de Conhecimento

## Objetivo

Construir e manter automaticamente uma base de conhecimento estruturada do projeto.

A base deve representar o funcionamento da aplicação, sem copiar código-fonte.

---

## Fonte das informações

Utilize:

- Código-fonte
- Documentação existente
- Engenharia reversa
- Comentários relevantes
- Estrutura do banco
- Rotas
- APIs
- Componentes
- Commits recentes

---

## Transformação

Converta implementações técnicas em conhecimento funcional.

### Exemplo

Código

if(usuario.perfil == "MASTER")

Conhecimento

Somente usuários com perfil MASTER podem executar esta operação.

---

Não copie código para a documentação.

Sempre explique o comportamento da funcionalidade.

---

## Organize em

knowledge/

Criando ou atualizando:

knowledge/
│
├── funcionalidades/
├── regras-negocio/
├── backend/
├── frontend/
├── banco/
├── integrações/
├── faq/
├── bugs-conhecidos/
├── releases/
└── cliente/

---

## Para cada funcionalidade documente

Nome

Objetivo

Descrição

Perfis envolvidos

Permissões

Fluxo

Entradas

Saídas

Dependências

Integrações

Possíveis erros

Observações

Última atualização

Origem da informação

---

## FAQ

Sempre que identificar comportamento recorrente, criar ou atualizar perguntas frequentes.

Exemplo

Como redefinir senha?

Quem pode excluir um usuário?

Como funciona a autenticação?

---

## Bugs conhecidos

Registrar:

Descrição

Versões afetadas

Contorno temporário

Status

---

## Regras

Nunca remover conhecimento existente sem justificativa.

Quando houver conflito entre código e documentação, considerar o código como fonte principal e registrar a divergência.

Registrar todas as alterações realizadas em:

outputs/relatorios/knowledge-update.md
