# Modificações Necessárias no Workflow n8n para Assessor de Candidato

Este documento detalha todas as modificações necessárias para transformar o workflow atual (atendimento de loja Rapidy Informática) em um sistema de **Assessor de Candidato**.

---

## 1. Modificações no Prompt do AI Agent (Node: "AI Agent")

### 1.1 System Message - Substituição Completa

**Localização:** Node "AI Agent" → `parameters.options.systemMessage`

**Substituir todo o conteúdo atual por:**

```
Você é um Assessor de Candidato especializado em avaliação e suporte para candidatos políticos, profissionais ou para processos seletivos. Sua função é auxiliar candidatos fornecendo informações, coletando dados de avaliação, agendando entrevistas e consultas, e gerenciando o processo de candidatura.

Você fala Português do Brasil, com um tom profissional, empático e direto.

---

Modelo de mensagem inicial oficial (Esse modelo é o padrão para início de interação com candidatos no whatsapp):

Olá! 👋
Bem-vindo ao Sistema de Assessoria de Candidatos ✨

Como posso ajudá-lo hoje?

📋 Informações sobre processos de candidatura
📝 Coleta de dados e documentação
📅 Agendamento de entrevistas e consultas
📊 Consulta de status de candidatura
📍 Informações sobre localização e horários
❓ Dúvidas frequentes sobre o processo

---

Tratamento de erros:

Se a(s) ferramenta(s) de "Catálogo de Candidaturas" ou "Catálogo de Serviços de Assessoria" não estiver disponível para consulta, siga o exemplo de mensagem a seguir:

Assessor (Você): No momento estou com dificuldades para acessar nosso sistema. Por favor, tente novamente em alguns minutos ou entre em contato pelo telefone [TELEFONE].

Se a candidatura não for encontrada:

Assessor (Você): Não encontrei essa candidatura em nossos registros. Pode me dar mais detalhes ou verificar se o nome ou ID está correto?

Se o agendamento não for encontrado:

Assessor (Você): Não encontrei nenhum registro com essas informações. Pode verificar se o nome ou ID está correto?

---

Exemplo de atendimento para candidato buscando informações sobre processo de candidatura (Você deve consultar a ferramenta de "Catálogo de Candidaturas" fornecida pelo servidor MCP para responder de volta ao candidato com as informações oficiais):

Candidato: quero me candidatar

Assessor (Você): Ótimo! Vou te ajudar com o processo de candidatura! 📋

📌 Processos disponíveis:

  Candidatura Política - Eleições Municipais
• Tipo: Candidatura a Vereador
• Requisitos: Maioridade, título de eleitor, filiação partidária
• Documentos necessários: RG, CPF, Título de Eleitor, Comprovante de Residência
• Prazo: Até [DATA]
• Status: Inscrições abertas

  Candidatura Política - Eleições Estaduais
• Tipo: Candidatura a Deputado Estadual
• Requisitos: Maioridade, título de eleitor, filiação partidária
• Documentos necessários: RG, CPF, Título de Eleitor, Comprovante de Residência
• Prazo: Até [DATA]
• Status: Inscrições abertas

Para iniciar sua candidatura, preciso saber:

• Nome completo
• CPF
• Tipo de candidatura desejada
• Partido político (se aplicável)

Posso te ajudar com mais alguma coisa? 📝

---

Exemplo de resposta padrão para candidato buscando agendamento de entrevista ou consulta (Você deve consultar a ferramenta de "Catálogo de Serviços de Assessoria" fornecida pelo servidor MCP):

Candidato: preciso agendar uma entrevista

Assessor (Você): Claro! Vou te ajudar a agendar uma entrevista! 📅

📋 Tipos de atendimento disponíveis:

• Entrevista inicial de candidatura
• Consulta sobre documentação
• Reunião de planejamento de campanha
• Avaliação de perfil do candidato

Para agendar, preciso saber:

• Nome completo
• Tipo de atendimento desejado
• Data e horário preferidos
• Telefone para contato

Candidato: João Silva, entrevista inicial, amanhã às 14h

Assessor (Você): Perfeito João, confirma o agendamento?

Candidato: sim

Assessor (Você): Agendamento confirmado! ✓

📝 Resumo do agendamento:

- ID do agendamento: JS-151225-1400
- Candidato: João Silva
- Tipo: Entrevista Inicial
- Data/Hora: 15/12/2025 às 14:00
- Status: Agendado

⚠️ Observações:

- Trazer documentação completa (RG, CPF, Título de Eleitor)
- Chegar com 15 minutos de antecedência

📍 Localização:
[ENDEREÇO DO GABINETE/ESCRITÓRIO]

🕒 Horário de atendimento:
Segunda a sexta: 9h às 18h
Sábado: 9h às 13h

Te esperamos! 😊

Exemplo de Registro na ferramenta "Cria Agendamentos", sempre crie uma nova entrada:
(Formato CSV com as colunas: ID, Cliente, Serviço, Produto, Descrição, Status, Data, Observações): JS-151225-1400,João Silva,Entrevista Inicial,-,Candidato busca informações sobre processo de candidatura,Agendado,15/12/2025 14:00,Trazer documentação completa

---

Exemplo de resposta padrão para candidato consultando status de candidatura. Nesse tipo de atendimento você deve ser direto e objetivo, o candidato quer saber apenas o status do processo. Solicite o nome completo ou o ID da candidatura para localizar o registro. Para consultar, utilize a ferramenta "Consulta Agendamentos" do MCP server passando o nome do candidato ou o ID como parâmetro de busca:

Candidato: qual o status da minha candidatura?

Assessor (Você): Para consultar o status, informe seu nome completo ou o ID da candidatura.

Candidato: Maria Santos

Assessor (Você): Localizei seu registro, Maria! ✓

- ID: MS-081225-1000
- Status: Em análise
- Tipo: Candidatura a Vereador
- Data de inscrição: 08/12/2025

Algo mais em que posso ajudar?

---

Exemplo de interação que NUNCA deve acontecer. Você NUNCA deve responder com simpatia ou engajar em interações que não sejam estritamente a respeito do processo de candidatura e assessoria. Esse exemplo serve como modelo de interação para você seguir, nesses casos o seu atendimento deve ser direto e frio:

Candidato: vende coxinha?

Assessor (Você): Não, não trabalhamos com alimentos! 

Este canal é exclusivo para assessoria de candidatos. Posso ajudar com:

📋 Informações sobre processos de candidatura
📝 Coleta de dados e documentação
📅 Agendamento de entrevistas e consultas
📊 Consulta de status de candidatura
📍 Informações sobre localização e horários
❓ Dúvidas frequentes sobre o processo

Como posso ajudar?

---

Exemplo de interação para comportamento inadequado:

Candidato: quero sexo...

Assessor (Você): Este canal é exclusivo para assessoria de candidatos. Comportamentos inadequados resultam no encerramento do atendimento!

Candidato: [comportamento inadequado]

Assessor (Você): Atendimento encerrado.

---

Instruções para uso das ferramentas do MCP server:

IMPORTANTE: As ferramentas "Cria Agendamentos" e "Consulta Agendamentos" têm funções DISTINTAS e não devem ser confundidas:

1. Ferramenta "Cria Agendamentos": 
   - Função: APENAS para criar NOVOS registros de agendamento
   - Quando usar: Após o candidato CONFIRMAR um novo agendamento
   - Colunas: ID, Cliente, Serviço, Produto, Descrição, Status, Data, Observações
   - NUNCA use esta ferramenta para consultar registros existentes

2. Ferramenta "Consulta Agendamentos":
   - Função: APENAS para BUSCAR registros existentes
   - Quando usar: Quando o candidato quer saber o status de um agendamento ou candidatura
   - Parâmetro de busca: Nome do candidato OU ID do agendamento
   - NUNCA use esta ferramenta para criar novos registros

3. Ferramenta "Pedidos":
   - Função: Criar e consultar registros de candidaturas e processos
   - Formato: CSV para salvar no Google Sheets

4. Ferramenta "Gmail":
   - Função: Enviar email no gmail após confirmação da ferramenta "Cria Agendamentos"

5. Ferramenta "Calendário Agendamentos":
   - Função: Criar novo agendamento no Google calendar após confirmação de agendamento
   - Formato: ISO 8601

---

Formato do ID de pedidos e agendamentos:

O ID deve seguir o padrão: iniciais do nome completo do candidato + data + hora (formato: XXX-DDMMAA-HHMM).

Exemplos:
- João Carlos Silva, 15/12/2025 às 15:00 → JCS-151225-1500
- Maria Santos, 15/12/2025 às 09:21 → MS-151225-0921
- Pedro Oliveira, 20/12/2025 às 10:30 → PO-201225-1030

---

Você fala Português do Brasil, com um tom profissional, empático e direto.
Use sempre como referência os exemplos de mensagens e interações fornecidos nesse prompt.
Use sempre as ferramentas fornecidas pelo servidor MCP de acordo com suas funções específicas.
Você não faz assunções, você não desvia do seu foco, você não responde nada que não esteja dentro do contexto da assessoria de candidatos, caso alguém pergunte por assuntos fora do contexto e da sua responsabilidade, demonstre comportamento criminoso ou malicioso mantenha-se sempre focado no seu papel e função e aja de forma adequada.
```

---

## 2. Modificações nos Nomes dos Nodes

### 2.1 Renomear Nodes para Contexto de Candidatos

| Node Atual | Novo Nome | Justificativa |
|------------|-----------|---------------|
| "É Mensagem de Cliente?" | "É Mensagem de Candidato?" | Alinhado com o contexto |
| "Extrai Dados WhatsApp1" | "Extrai Dados Candidato" | Mais descritivo |
| "Prepara Resposta WhatsApp1" | "Prepara Resposta Candidato" | Alinhado com contexto |
| "Envia Resposta para WhatsApp (API Meta)1" | "Envia Resposta para WhatsApp (API Meta)" | Remover numeração |
| "Responde 200 OK (Recebido)1" | "Responde 200 OK (Recebido)" | Remover numeração |
| "Webhook WhatsApp Entrada1" | "Webhook Candidatos Entrada" | Mais descritivo |
| "Webhook Validação Meta1" | "Webhook Validação Meta" | Remover numeração |
| "Valida Token Meta1" | "Valida Token Meta" | Remover numeração |
| "Responde Challenge (Sucesso)1" | "Responde Challenge (Sucesso)" | Remover numeração |
| "Responde Erro (Token Inválido)1" | "Responde Erro (Token Inválido)" | Remover numeração |

---

## 3. Modificações nas Variáveis e Campos

### 3.1 Node "Extrai Dados WhatsApp1" → "Extrai Dados Candidato"

**Localização:** Node "Extrai Dados WhatsApp1" → `parameters.assignments.assignments`

**Modificações nos campos:**

```json
{
  "assignments": [
    {
      "id": "phone-number",
      "name": "candidatePhone",
      "value": "={{ $json.body.entry[0].changes[0].value.messages[0].from }}",
      "type": "string"
    },
    {
      "id": "message-text",
      "name": "candidateMessage",
      "value": "={{ $json.body.entry[0].changes[0].value.messages[0].text.body }}",
      "type": "string"
    },
    {
      "id": "message-id",
      "name": "messageId",
      "value": "={{ $json.body.entry[0].changes[0].value.messages[0].id }}",
      "type": "string"
    },
    {
      "id": "contact-name",
      "name": "candidateName",
      "value": "={{ $json.body.entry[0].changes[0].value.contacts[0].profile.name }}",
      "type": "string"
    },
    {
      "id": "session-id",
      "name": "sessionId",
      "value": "={{ $json.body.entry[0].changes[0].value.messages[0].from }}",
      "type": "string"
    },
    {
      "id": "chat-input",
      "name": "chatInput",
      "value": "={{ $json.body.entry[0].changes[0].value.messages[0].text.body }}",
      "type": "string"
    }
  ]
}
```

### 3.2 Node "Prepara Resposta WhatsApp1" → "Prepara Resposta Candidato"

**Localização:** Node "Prepara Resposta WhatsApp1" → `parameters.assignments.assignments[1].value`

**Modificar a referência:**

```json
{
  "id": "response-body",
  "name": "responseBody",
  "value": "={{ {\n  \"messaging_product\": \"whatsapp\",\n  \"to\": $('Extrai Dados Candidato').item.json.candidatePhone,\n  \"type\": \"text\",\n  \"text\": {\n    \"body\": $json.output\n  }\n} }}",
  "type": "object"
}
```

---

## 4. Modificações nas Ferramentas do MCP (Google Sheets Tools)

### 4.1 Renomear Ferramentas

| Ferramenta Atual | Novo Nome | Descrição |
|------------------|-----------|-----------|
| "Catálogo de Produtos" | "Catálogo de Candidaturas" | Lista de processos de candidatura disponíveis |
| "Catálogo de Serviços" | "Catálogo de Serviços de Assessoria" | Serviços de assessoria oferecidos |
| "FAQ" | "FAQ Candidatos" | Perguntas frequentes sobre candidaturas |
| "Descontos" | "Critérios de Avaliação" | Critérios e requisitos para candidaturas |
| "Pedidos" | "Registro de Candidaturas" | Registro de candidaturas e processos |
| "Cria Agendamentos" | "Cria Agendamentos" | (Manter nome, mas contexto muda) |
| "Consulta Agendamentos" | "Consulta Agendamentos" | (Manter nome, mas contexto muda) |

### 4.2 Atualizar Estrutura das Planilhas Google Sheets

**Para "Catálogo de Candidaturas" (antigo "Catálogo de Produtos"):**

Colunas sugeridas:
- Tipo de Candidatura
- Categoria (Política, Profissional, etc.)
- Requisitos
- Documentos Necessários
- Prazo de Inscrição
- Status (Aberto, Fechado, Em Análise)
- Observações

**Para "Catálogo de Serviços de Assessoria" (antigo "Catálogo de Serviços"):**

Colunas sugeridas:
- Serviço
- Categoria (Entrevista, Consulta, Avaliação, etc.)
- Tipo de Cobrança
- Preço Unitário
- Prazo (horas)
- Observações
- Ativo

**Para "Registro de Candidaturas" (antigo "Pedidos"):**

Colunas sugeridas:
- ID
- Candidato
- Tipo de Candidatura
- Status
- Descrição
- Data de Inscrição
- Data de Análise
- Observações
- Avaliação
- Resultado

**Para "Agendamentos":**

Colunas sugeridas:
- ID
- Candidato
- Tipo de Atendimento
- Data/Hora
- Status
- Observações
- Avaliador Responsável

---

## 5. Modificações nos Webhooks Admin

### 5.1 Webhook "admin-pedidos" → "admin-candidaturas"

**Localização:** Node "Webhook Pedidos"

**Modificações:**
- `path`: "admin-pedidos" → "admin-candidaturas"
- `name`: "Webhook Pedidos" → "Webhook Candidaturas"
- `webhookId`: "admin-pedidos" → "admin-candidaturas"

### 5.2 Node "Ler Pedidos" → "Ler Candidaturas"

**Localização:** Node "Ler Pedidos"

**Modificações:**
- `name`: "Ler Pedidos" → "Ler Candidaturas"
- `sheetName`: Verificar se a planilha foi renomeada no Google Sheets

### 5.3 Node "Formatar Pedidos" → "Formatar Candidaturas"

**Localização:** Node "Formatar Pedidos"

**Modificações:**
- `name`: "Formatar Pedidos" → "Formatar Candidaturas"

### 5.4 Node "Responder Pedidos" → "Responder Candidaturas"

**Localização:** Node "Responder Pedidos"

**Modificações:**
- `name`: "Responder Pedidos" → "Responder Candidaturas"

---

## 6. Modificações no Node "É Mensagem de Cliente?"

**Localização:** Node "É Mensagem de Cliente?" → `parameters.conditions.conditions[0]`

**Manter a lógica, mas atualizar comentários/notas se houver:**

A lógica de verificação de mensagem permanece a mesma, mas pode adicionar uma nota:
- `notes`: "Verifica se a mensagem recebida é de um candidato (contém ID de mensagem)"

---

## 7. Modificações no Gmail Tool

**Localização:** Node "Gmail"

**Modificações sugeridas:**
- `sendTo`: Atualizar para email apropriado do assessor/coordenador
- `subject`: Template pode ser: "Nova Candidatura - {{candidateName}}" ou "Novo Agendamento - {{candidateName}}"
- `message`: Template pode incluir informações sobre a candidatura ou agendamento

---

## 8. Modificações no Calendário Agendamentos

**Localização:** Node "Calendário Agendamentos"

**Modificações sugeridas:**
- `summary`: Template pode ser: "Entrevista - {{candidateName}}" ou "Consulta - {{candidateName}}"
- `description`: Incluir informações relevantes sobre o candidato e tipo de atendimento

---

## 9. Checklist de Implementação

### 9.1 Modificações no n8n Workflow

- [ ] Atualizar system message do AI Agent
- [ ] Renomear todos os nodes conforme tabela
- [ ] Atualizar variáveis em "Extrai Dados Candidato"
- [ ] Atualizar referências de variáveis em "Prepara Resposta Candidato"
- [ ] Renomear webhook "admin-pedidos" para "admin-candidaturas"
- [ ] Renomear nodes relacionados a pedidos para candidaturas
- [ ] Atualizar referências de planilhas Google Sheets

### 9.2 Modificações no Google Sheets

- [ ] Criar/renomear planilha "Catálogo de Candidaturas"
- [ ] Criar/renomear planilha "Catálogo de Serviços de Assessoria"
- [ ] Criar/renomear planilha "Registro de Candidaturas"
- [ ] Atualizar estrutura de colunas conforme seção 4.2
- [ ] Popular dados iniciais nas planilhas
- [ ] Verificar permissões e credenciais

### 9.3 Modificações no Frontend (se necessário)

- [ ] Atualizar endpoints de API de "pedidos" para "candidaturas"
- [ ] Atualizar labels e textos na interface
- [ ] Atualizar componentes relacionados
- [ ] Atualizar contextos e hooks
- [ ] Atualizar rotas se necessário

### 9.4 Testes

- [ ] Testar recebimento de mensagens WhatsApp
- [ ] Testar criação de agendamento
- [ ] Testar consulta de status
- [ ] Testar registro de candidatura
- [ ] Testar webhooks admin
- [ ] Testar integração com Google Calendar
- [ ] Testar envio de emails

---

## 10. Considerações Adicionais

### 10.1 Privacidade e LGPD

- Garantir que dados de candidatos sejam tratados conforme LGPD
- Implementar medidas de segurança adequadas
- Considerar criptografia de dados sensíveis

### 10.2 Personalização por Contexto

Dependendo do tipo de candidatura (política, profissional, etc.), ajustar:
- Terminologia específica
- Campos de dados coletados
- Critérios de avaliação
- Processos de aprovação

### 10.3 Integrações Futuras

Considerar integrações com:
- Sistemas eleitorais (TSE, TRE)
- Plataformas de recrutamento
- Sistemas de CRM
- Ferramentas de análise de perfil

---

## 11. Exemplo de Estrutura de Dados

### 11.1 Exemplo de Candidatura

```json
{
  "ID": "JS-151225-1400",
  "Candidato": "João Silva",
  "Tipo de Candidatura": "Candidatura a Vereador",
  "Status": "Em Análise",
  "Descrição": "Candidato busca informações sobre processo de candidatura",
  "Data de Inscrição": "15/12/2025",
  "Observações": "Documentação completa pendente",
  "Avaliação": "Pendente",
  "Resultado": "Pendente"
}
```

### 11.2 Exemplo de Agendamento

```json
{
  "ID": "JS-151225-1400",
  "Candidato": "João Silva",
  "Tipo de Atendimento": "Entrevista Inicial",
  "Data": "15/12/2025 14:00",
  "Status": "Agendado",
  "Observações": "Trazer documentação completa",
  "Avaliador Responsável": "Maria Assessora"
}
```

---

**Documento criado para guiar a transformação do workflow n8n de atendimento de loja para sistema de Assessor de Candidato.**




