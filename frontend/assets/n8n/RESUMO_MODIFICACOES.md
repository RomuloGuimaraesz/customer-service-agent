# Resumo Executivo - Modificações para Assessor de Candidato

## 🎯 Objetivo

Transformar o workflow n8n de **atendimento de loja (Rapidy Informática)** em um sistema de **Assessor de Candidato** para gerenciar processos de candidatura, agendamentos e avaliações.

---

## 📋 Principais Mudanças

### 1. **Prompt do AI Agent** (CRÍTICO)
- **Mudança:** Substituir completamente o system message
- **De:** Agente de atendimento de loja de informática
- **Para:** Assessor de Candidato especializado em avaliação e suporte
- **Impacto:** ALTO - Define todo o comportamento do bot

### 2. **Nomenclatura de Nodes**
- "Cliente" → "Candidato"
- "Pedidos" → "Candidaturas"
- "Produtos" → "Candidaturas Disponíveis"
- "Serviços" → "Serviços de Assessoria"

### 3. **Variáveis e Campos**
- `phoneNumber` → `candidatePhone`
- `messageText` → `candidateMessage`
- `contactName` → `candidateName`
- Atualizar todas as referências nos nodes

### 4. **Google Sheets - Estrutura de Dados**
- **Catálogo de Produtos** → **Catálogo de Candidaturas**
  - Colunas: Tipo, Categoria, Requisitos, Documentos, Prazo, Status
- **Catálogo de Serviços** → **Catálogo de Serviços de Assessoria**
  - Colunas: Serviço, Categoria, Tipo de Cobrança, Prazo, Observações
- **Pedidos** → **Registro de Candidaturas**
  - Colunas: ID, Candidato, Tipo, Status, Data, Avaliação, Resultado

### 5. **Webhooks Admin**
- `admin-pedidos` → `admin-candidaturas`
- Atualizar endpoints no frontend

---

## 🔧 Ordem de Implementação Recomendada

### Fase 1: Preparação (Google Sheets)
1. Criar/renomear planilhas no Google Sheets
2. Definir estrutura de colunas
3. Popular dados iniciais
4. Verificar permissões

### Fase 2: Workflow n8n
1. Fazer backup do workflow atual
2. Atualizar system message do AI Agent
3. Renomear nodes
4. Atualizar variáveis e referências
5. Atualizar configurações de ferramentas MCP

### Fase 3: Integrações
1. Atualizar webhooks admin
2. Testar integração com Google Calendar
3. Testar envio de emails
4. Verificar integração WhatsApp

### Fase 4: Frontend (se necessário)
1. Atualizar endpoints de API
2. Atualizar labels e textos
3. Atualizar componentes
4. Testar interface

---

## ⚠️ Pontos de Atenção

1. **Backup:** Sempre fazer backup antes de modificar
2. **Testes:** Testar cada modificação isoladamente
3. **Credenciais:** Verificar se todas as credenciais estão corretas
4. **Permissões:** Garantir permissões adequadas no Google Sheets
5. **LGPD:** Considerar privacidade de dados de candidatos

---

## 📊 Impacto por Componente

| Componente | Impacto | Complexidade | Prioridade |
|------------|---------|--------------|------------|
| System Message AI Agent | ALTO | MÉDIA | CRÍTICA |
| Renomear Nodes | BAIXO | BAIXA | ALTA |
| Variáveis | MÉDIO | MÉDIA | ALTA |
| Google Sheets | ALTO | ALTA | CRÍTICA |
| Webhooks | MÉDIO | BAIXA | MÉDIA |
| Frontend | BAIXO | BAIXA | BAIXA |

---

## 🚀 Quick Start

1. **Leia o documento completo:** `MODIFICACOES_ASSESSOR_CANDIDATO.md`
2. **Faça backup do workflow atual**
3. **Comece pelo System Message** (maior impacto)
4. **Teste incrementalmente** cada mudança
5. **Valide com dados reais** antes de produção

---

**Para detalhes completos, consulte:** `MODIFICACOES_ASSESSOR_CANDIDATO.md`




