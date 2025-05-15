# Prompt para Lovable: Criação de Aplicação SaaS de FlowBuilder para WhatsApp

## 1. Visão Geral da Aplicação a Ser Criada

Construa uma plataforma SaaS completa, que pode ser nomeada **FlowBot SaaS**. O objetivo principal é um MVP (Minimum Viable Product) que permita aos usuários (clientes do SaaS) construir visualmente fluxos de chatbot (flow builder), com foco inicial na integração com o WhatsApp.

A plataforma deve incluir:
*   Um sistema de gerenciamento de usuários (clientes do SaaS).
*   Suporte para diferentes planos de assinatura.
*   Integração com o sistema de pagamentos Stripe.
*   Garantia de total isolamento de dados entre os diferentes clientes do SaaS.
*   O público-alvo são pequenas e médias empresas, profissionais de marketing e desenvolvedores que buscam uma forma intuitiva e visual de criar e gerenciar chatbots para WhatsApp, sem necessidade de programação complexa para a lógica dos fluxos.

## 2. Arquitetura Funcional da Aplicação

A aplicação será composta por uma interface de usuário (frontend) e uma lógica de servidor (backend) para gerenciar as operações.

*   **Interface do Usuário (Frontend):**
    *   Deve ser uma aplicação web moderna e responsiva.
    *   **Construtor de Fluxos (Flow Builder UI):** Esta é a interface central para que os clientes criem e editem seus fluxos de chatbot. Deve ser altamente interativa, com funcionalidade de arrastar e soltar elementos. As funcionalidades incluem:
        *   Uma área de desenho (canvas) ampla para a criação dos fluxos.
        *   Uma paleta com os diferentes tipos de nós (blocos de construção do fluxo) que podem ser arrastados para o canvas.
        *   Capacidade de conectar os nós através de pontos de entrada e saída.
        *   Um painel de propriedades que surge ao selecionar um nó, permitindo sua configuração detalhada.
        *   Controles para zoom, movimentação no canvas (pan), salvar, carregar e validar os fluxos.
    *   **Painel de Controle do Cliente:** Uma área dedicada onde os clientes do SaaS gerenciam suas contas, os fluxos que criaram, as configurações de integração (especialmente WhatsApp), suas assinaturas e informações de faturamento.

*   **Lógica do Servidor (Backend):**
    *   Deve implementar um sistema de autenticação seguro para proteger o acesso às funcionalidades e dados.
    *   **Módulos Funcionais Chave do Backend:**
        *   **Gerenciamento de Usuários:** Para registro, login e gerenciamento de perfis dos clientes do SaaS.
        *   **Gerenciamento de Planos e Assinaturas:** Para definir e administrar os diferentes níveis de serviço e suas respectivas limitações.
        *   **Integração com Stripe:** Para processar pagamentos, gerenciar o ciclo de vida das assinaturas e lidar com notificações (webhooks) do Stripe.
        *   **Motor do Construtor de Fluxos:** Para salvar, carregar e validar as definições dos fluxos criados pelos usuários.
        *   **Motor de Execução de Fluxos:** Para interpretar e executar os fluxos de chatbot em tempo real, com base nas interações dos usuários finais (via WhatsApp).
        *   **Integração com WhatsApp:** Para gerenciar a comunicação bidirecional com a API do WhatsApp.
        *   **Isolamento de Dados (Multitenancy):** Para assegurar que cada cliente do SaaS acesse exclusivamente seus próprios dados.

## 3. Funcionalidades de Gerenciamento de Usuários (Clientes do SaaS)

*   **Cadastro:** Permitir que novos usuários se registrem fornecendo nome, endereço de e-mail e senha. O sistema deve prever o envio de e-mail de confirmação.
*   **Login:** Autenticar usuários existentes com e-mail e senha. Implementar medidas de proteção contra tentativas de acesso indevido.
*   **Recuperação de Senha:** Permitir que usuários redefinam suas senhas através de um mecanismo seguro (ex: link enviado por e-mail).
*   **Gerenciamento de Perfil:** Permitir que usuários logados atualizem suas informações pessoais (nome, e-mail) e alterem sua senha.
*   **Papéis de Usuário:** Inicialmente, focar no papel de "Cliente". Um papel de "Administrador do SaaS" deve ser considerado para o gerenciamento da plataforma.

## 4. Funcionalidades de Gerenciamento de Planos e Assinaturas

*   **Definição de Planos:** O administrador do SaaS deve ter uma interface para definir múltiplos planos de assinatura (ex: Gratuito, Básico, Pro).
*   **Atributos do Plano:** Cada plano deve ter um nome, preço (mensal/anual) e limites específicos, como:
    *   Número máximo de fluxos ativos.
    *   Número máximo de mensagens processadas por mês.
    *   Número máximo de contatos ativos.
    *   Acesso a tipos de nós específicos (nós premium podem ser restritos a planos superiores).
    *   Número de integrações WhatsApp permitidas.
*   **Seleção de Plano:** Novos usuários devem poder selecionar um plano durante o cadastro ou iniciar com um plano gratuito/trial.
*   **Upgrade/Downgrade de Plano:** Clientes existentes devem poder mudar de plano. O sistema deve gerenciar a transição de cobrança adequadamente via Stripe.
*   **Visualização do Plano:** O cliente deve poder visualizar seu plano atual, o uso dos recursos em relação aos limites e a data da próxima renovação.

## 5. Funcionalidades de Integração com Stripe

*   **Checkout de Assinatura:** Integrar com o Stripe para que os clientes possam se inscrever em planos pagos de forma segura.
*   **Gerenciamento de Assinaturas:** Utilizar o Stripe para gerenciar o ciclo de vida das assinaturas (criação, atualização, cancelamento).
*   **Webhooks do Stripe:** Implementar capacidade de receber e processar webhooks do Stripe para eventos importantes (ex: pagamento bem-sucedido, falha no pagamento, assinatura cancelada).
*   **Portal do Cliente Stripe (Recomendado):** Considerar a integração do portal do cliente do Stripe para que os usuários gerenciem seus métodos de pagamento e faturas.
*   **Segurança de Pagamento:** A manipulação direta de dados de cartão de crédito deve ser evitada, delegando essa responsabilidade ao Stripe.

## 6. Requisito de Isolamento de Dados (Multitenancy)

*   **Princípio Fundamental:** Cada cliente (tenant) do SaaS deve ter seus dados completamente isolados. Um cliente não deve, sob nenhuma circunstância, conseguir acessar ou visualizar dados de outro cliente.
*   **Dados a Isolar:** Incluem, mas não se limitam a: fluxos, definições de nós, execuções de fluxos, contatos do WhatsApp, configurações da API do WhatsApp, histórico de mensagens (se armazenado), logs específicos do cliente e informações de faturamento.
*   **Implementação:** A lógica de isolamento deve ser aplicada em todas as consultas e operações de dados, geralmente associando cada registro de dados ao identificador único do cliente (tenant).

## 7. Funcionalidades de Integração com WhatsApp

*   **API do WhatsApp:** A integração deve ser feita com a API Oficial do WhatsApp Business.
*   **Configuração pelo Cliente:**
    *   Os clientes do SaaS devem poder conectar suas contas do WhatsApp Business API à plataforma.
    *   Isso envolverá o fornecimento seguro das credenciais da API do WhatsApp necessárias.
    *   A plataforma deve fornecer um URL de Webhook que o cliente configurará em sua conta Meta for Developers para o recebimento de mensagens.
*   **Recebimento de Mensagens (Entrada):**
    *   O backend deve possuir um endpoint de webhook para receber notificações de mensagens do WhatsApp.
    *   Este endpoint deve identificar corretamente o cliente do SaaS (tenant) ao qual a mensagem se destina.
    *   Ao receber uma mensagem, o sistema deve localizar o fluxo ativo associado àquele número de WhatsApp do cliente e iniciar ou continuar a execução do fluxo.
*   **Envio de Mensagens (Saída):**
    *   Os nós do flow builder (ex: "Enviar Mensagem") instruirão o backend a enviar mensagens para o WhatsApp através da API configurada pelo cliente.
*   **Tipos de Mensagem Suportados (MVP):**
    *   Texto (com suporte a variáveis e emojis).
    *   Imagens (requer URL da imagem).
    *   Vídeos (requer URL do vídeo).
    *   Documentos (requer URL do documento).
    *   Botões de Resposta Rápida.
    *   Botões de Ação (Call to Action - para URL, para Ligar).
    *   Mensagens de Lista.
    *   Mensagens de Template (HSM): Essencial para iniciar conversas ou enviar notificações. O cliente deve poder selecionar e usar templates pré-aprovados.
*   **Gerenciamento de Contatos:** O sistema deve manter um registro básico dos contatos do WhatsApp que interagem com os fluxos de cada cliente.

## 8. Interface do Construtor de Fluxos (Flow Builder) - Detalhes Funcionais

*   **Área de Trabalho (Canvas):**
    *   Deve permitir a renderização visual dos nós como blocos e das conexões como linhas ou curvas direcionais.
    *   Permitir seleção de múltiplos nós, movimentação em grupo.
    *   Opcional: grade de fundo para alinhamento e minimapa para navegação em fluxos grandes.
*   **Paleta de Nós:**
    *   Uma barra lateral ou menu flutuante listando todos os tipos de nós disponíveis, possivelmente agrupados por categoria.
    *   Função de busca na paleta de nós.
*   **Painel de Configuração de Nós:**
    *   Deve aparecer ao clicar em um nó no canvas.
    *   Exibir campos de formulário específicos para as propriedades do nó selecionado.
    *   Validação em tempo real dos campos.
    *   Mecanismo para salvar as configurações do nó.
*   **Conexões:**
    *   Cada nó terá "portas" ou "handles" de entrada e saída claramente visíveis.
    *   O usuário deve poder clicar e arrastar de uma porta de saída de um nó para uma porta de entrada de outro para criar uma conexão.
    *   Validação para impedir conexões inválidas.
    *   Possibilidade de deletar conexões.
*   **Gerenciamento de Fluxos:**
    *   Salvar o estado atual do fluxo (estrutura dos nós e conexões).
    *   Opção de "Salvar como Rascunho" e "Publicar". Somente fluxos publicados devem ser executados.
    *   Permitir nomear/renomear fluxos.
    *   Permitir duplicar fluxos.
    *   Permitir deletar fluxos.

## 9. Tipos de Nós do Flow Builder (MVP) - Descrição Funcional

Para cada nó, descreva as seguintes características funcionais:
*   **Nome do Nó:** Ex: "Enviar Mensagem de Texto".
*   **Ícone Sugerido:** Uma breve descrição visual (ex: "balão de fala").
*   **Descrição/Propósito:** O que o nó faz no fluxo.
*   **Portas de Entrada/Saída:** Quantas e qual a lógica de suas conexões.
*   **Campos de Configuração:** Lista de campos que o usuário preencherá, tipo de informação esperada e se suportam variáveis (ex: `{{nome_do_contato}}`).
*   **Comportamento em Execução:** Como o nó processa a informação, interage com o WhatsApp ou modifica o estado do fluxo.

**Lista de Nós Essenciais para o MVP:**

1.  **Nó de Início (Start Trigger):** Ponto de entrada de um fluxo; define como o fluxo é acionado (ex: primeira mensagem, palavra-chave).
2.  **Nó de Enviar Mensagem de Texto:** Envia uma mensagem de texto simples para o usuário no WhatsApp.
3.  **Nó de Enviar Mídia:** Envia um arquivo de mídia (imagem, vídeo, áudio, documento) para o usuário.
4.  **Nó de Perguntar e Esperar Resposta:** Pausa o fluxo, aguarda uma resposta do usuário e armazena essa resposta em uma variável. Pode incluir validação básica da resposta e tempo limite.
5.  **Nó de Botões de Resposta Rápida:** Envia uma mensagem acompanhada de botões de resposta rápida. O fluxo continua pela saída correspondente ao botão tocado.
6.  **Nó de Botões de Ação (Interactive Buttons):** Envia uma mensagem com botões de ação persistentes (ex: visitar URL, ligar). O fluxo pode continuar com base no payload retornado por botões do tipo resposta.
7.  **Nó de Mensagem de Lista:** Envia uma mensagem de lista interativa. O fluxo continua pela saída correspondente ao item selecionado.
8.  **Nó de Condição (If/Else Logic):** Direciona o fluxo com base em uma ou mais condições lógicas sobre variáveis, com saídas para "verdadeiro" e "falso".
9.  **Nó de Atraso (Delay / Wait):** Pausa a execução do fluxo por um período determinado.
10. **Nó de Requisição HTTP (API Call):** Faz uma requisição para uma API externa para buscar ou enviar dados, com saídas para "sucesso" e "erro", e mapeamento da resposta para variáveis do fluxo.
11. **Nó de Definir Variável:** Cria ou atualiza o valor de uma variável de contexto do fluxo.
12. **Nó de Transferência para Humano:** Pausa o chatbot e notifica um agente humano para assumir a conversa (a notificação pode ser um email ou webhook).
13. **Nó de Ir Para Fluxo:** Transfere a conversa para outro fluxo existente.
14. **Nó de Fim:** Indica o término de um caminho específico no fluxo.

## 10. Motor de Execução de Fluxos - Lógica Funcional

O backend deve possuir um motor de execução com as seguintes responsabilidades:
*   Carregar a definição do fluxo publicado.
*   Gerenciar o estado da conversa para cada interação de um contato do WhatsApp, incluindo o nó atual e valores de variáveis.
*   Interpretar e executar cada nó sequencialmente ou com base em lógica condicional.
*   Interagir com o módulo de integração do WhatsApp para enviar e receber mensagens.
*   Tratar erros durante a execução e registrar logs.
*   Persistir o estado da conversa para suportar interações assíncronas.

## 11. Entidades de Dados e Seus Atributos Funcionais

Descreva as principais entidades de dados e os atributos que elas precisam armazenar para suportar as funcionalidades:

*   **Clientes do SaaS (Tenants):** Identificador, nome, e-mail, informações de autenticação, referência ao plano de assinatura, status da assinatura, identificador no Stripe, datas de registro.
*   **Planos de Assinatura:** Identificador, nome, preço, referência ao preço no Stripe, conjunto de funcionalidades/limites (ex: nº de fluxos, nº de mensagens), status de ativação.
*   **Fluxos (Flows):** Identificador, referência ao cliente proprietário, nome, definição do fluxo em rascunho (estrutura de nós e conexões), definição do fluxo publicado, status (rascunho, publicado), referência à integração WhatsApp utilizada, datas de criação/atualização/publicação.
*   **Integrações WhatsApp:** Identificador, referência ao cliente proprietário, credenciais da API do WhatsApp (armazenadas de forma segura), status da validade da integração.
*   **Contatos do WhatsApp (por Cliente):** Identificador, referência ao cliente proprietário, número do contato no WhatsApp, nome (opcional), campos customizados para variáveis, tags (opcional), datas.
*   **Sessões de Fluxo (Estado das Conversas):** Identificador, referência ao contato, referência ao fluxo, identificador do nó atual, variáveis da sessão, status da sessão (ativa, aguardando, completa, erro), datas.
*   **Logs de Mensagens (Opcional):** Para auditoria, referenciando a sessão do fluxo, direção da mensagem (entrada/saída), conteúdo e data/hora.

## 12. Operações da API Necessárias (Backend) - Descrição Funcional

O backend deve expor operações (API) para suportar as seguintes funcionalidades do frontend e integrações externas. Todas as operações, exceto as públicas (ex: webhook do Stripe, webhook do WhatsApp, registro/login), devem ser protegidas.

*   **Autenticação:** Registrar novo cliente, realizar login, obter dados do usuário logado.
*   **Planos e Assinaturas:** Listar planos disponíveis, iniciar processo de checkout de assinatura (via Stripe), visualizar assinatura atual do cliente, solicitar cancelamento de assinatura.
*   **Webhook do Stripe:** Receber e processar eventos do Stripe.
*   **Configurações de Integração WhatsApp:** Criar/listar/atualizar/deletar configurações de integração do WhatsApp para o cliente logado.
*   **Gerenciamento de Fluxos:** Criar novo fluxo, listar fluxos do cliente, obter detalhes de um fluxo, atualizar nome e/ou definição de rascunho de um fluxo, deletar um fluxo, publicar um fluxo, obter a definição publicada de um fluxo (para a engine).
*   **Webhook de Entrada do WhatsApp:** Receber mensagens do WhatsApp, identificar o cliente correspondente e encaminhar para o motor de execução de fluxos.

## 13. Interface do Usuário (Frontend) - Descrição Funcional Detalhada

*   **Páginas de Login/Cadastro:** Formulários para entrada e registro de clientes.
*   **Layout Principal (Após Login):**
    *   Navegação clara com acesso ao perfil do usuário, faturamento e opção de sair.
    *   Menu principal para acessar Dashboard, Fluxos, Contatos (pós-MVP), Configurações.
*   **Dashboard:**
    *   Visão geral com resumo de fluxos, status da assinatura.
    *   Acesso rápido para criar novo fluxo e lista de fluxos recentes.
*   **Página de Listagem de Fluxos:**
    *   Exibição tabular ou em grade dos fluxos do cliente com nome, status, datas e ações (Editar, Publicar, Duplicar, Deletar).
    *   Funcionalidade de filtro e busca.
*   **Editor de Fluxos (Página Dedicada):**
    *   Layout intuitivo com paleta de nós, área de canvas central e painel de propriedades do nó selecionado.
    *   Barra de ferramentas com nome do fluxo, botões de Salvar, Publicar, Testar (simulador - pós-MVP), controles de zoom.
*   **Página de Configurações da Conta:**
    *   Seção de Perfil: Editar dados pessoais, alterar senha.
    *   Seção de Faturamento: Visualizar plano atual, uso de recursos, histórico de faturas (pode linkar para o portal Stripe), opções para gerenciar assinatura.
*   **Página de Configurações de Integração (WhatsApp):**
    *   Formulário para adicionar/editar credenciais da API do WhatsApp Business.
    *   Exibição do URL do Webhook a ser configurado na plataforma Meta.
    *   Indicação do status da integração.

Este prompt descreve as funcionalidades e requisitos para a criação da aplicação SaaS FlowBot. Deixe que Lovable determine as melhores tecnologias e abordagens de implementação para atender a estes requisitos.
