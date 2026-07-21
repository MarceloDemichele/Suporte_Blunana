# Massa de teste ficticia - Blunana HML

## Objetivo

Validar formularios, mensagens, inclusoes, consultas, edicoes e limpeza no HML sem utilizar dados de clientes, processos ou usuarios reais.

Arquivo executavel de referencia: `staging/blunana/massa-teste-hml.json`.

## Identificacao

Todos os registros criados devem iniciar com `AUTO-SUPORTE-HML` ou `AUTO-HML` e receber um `runId` no formato `yyyyMMdd-HHmmss`.

Essa identificacao permite localizar e remover os dados ao final, além de impedir confusao com registros funcionais.

## Dependencias obrigatorias

Antes de executar gravacoes, preencher no arquivo local `.env.hml` as variaveis abaixo com opcoes explicitamente autorizadas para teste:

- cliente de teste;
- area do cliente;
- area de ateste;
- tipo de acao;
- tipo de prazo;
- responsavel de teste;
- papel do usuario.

Variaveis: `HML_TEST_CLIENT`, `HML_TEST_CLIENT_AREA`, `HML_TEST_ATTEST_AREA`, `HML_TEST_ACTION_TYPE`, `HML_TEST_DEADLINE_TYPE`, `HML_TEST_RESPONSIBLE` e `HML_TEST_USER_ROLE`.

Esses valores nao devem ser adicionados ao JSON ou ao Git.

O executor futuro deve bloquear qualquer submissao se uma dessas opcoes estiver vazia ou se a opcao encontrada na tela nao corresponder exatamente ao texto autorizado.

Na tela `Configuracao do Prazo`, o Cliente ja vem predefinido pelo sistema. O automatizador nao deve tentar alterar esse campo; deve iniciar a selecao por Area do Cliente.

Para pre-testes sem gravacao, `HML_ALLOW_ANY_OPTION=true` permite selecionar a primeira opcao disponivel quando o descritor configurado nao for encontrado. Esse fallback e exclusivo de HML e nao autoriza submissao automatica.

## Dados seguros

- Dominio de e-mail: `example.com`, reservado para exemplos e sem entrega operacional esperada.
- CPF/CNPJ: vazio.
- Celular: vazio; se a tela exigir telefone valido, o teste deve parar ate existir numero HML autorizado.
- Numero de processo: identificador ficticio com ano 2099 e tribunal inexistente para evitar confusao com processo real.
- Permissoes do usuario: todas desmarcadas por padrao.
- Valor de regra de ateste: `R$ 1,00`.

## Ordem proposta de execucao

1. Validar campos obrigatorios sem preencher e sem persistir.
2. Criar Tipo de Ateste ficticio.
3. Criar Regra de Ateste vinculada ao tipo ficticio.
4. Criar Usuario ficticio com permissoes desmarcadas.
5. Criar configuracoes de Publicacao, Prazo e Processo usando somente opcoes autorizadas.
6. Criar Processo ficticio.
7. Localizar cada registro pelos filtros.
8. Abrir detalhes e validar leitura.
9. Validar edicao controlada, mantendo o prefixo.
10. Excluir os registros na ordem inversa das dependencias.

## Ordem de limpeza

1. Processo ficticio.
2. Configuracao de Processo.
3. Configuracao de Prazo.
4. Configuracao de Publicacao.
5. Regra de Ateste.
6. Tipo de Ateste.
7. Usuario ficticio.

Se alguma exclusao nao estiver disponivel ou falhar, o ciclo deve terminar como `cleanup-pendente` e registrar a rota, o tipo e o identificador do registro, sem copiar dados reais.

## Criterios de interrupcao

O teste deve parar antes de salvar quando:

- uma opcao autorizada nao existir;
- a tela tentar usar cliente ou responsavel diferente da allowlist;
- houver indicio de notificacao por e-mail, SMS ou integracao externa;
- CPF/CNPJ ou celular se tornarem obrigatorios;
- a acao puder atingir registros fora do prefixo de automacao;
- nao houver caminho comprovado de limpeza.

## Estado atual

Massa definida, mas ainda nao liberada para gravacao. A secao `allowedExistingOptions` permanece vazia e funciona como bloqueio de seguranca.
