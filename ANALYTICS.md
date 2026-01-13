# Sistema de Analytics - Estatísticas de Uso

## Visão Geral

Foi implementado um sistema completo de rastreamento de uso da aplicação, focado inicialmente em monitorar o uso das abas (Agendamentos, Pedidos e WhatsApp). O sistema coleta dados sobre cliques e tempo de permanência em cada aba.

## Funcionalidades Implementadas

### 1. Rastreamento Automático

- **Cliques em Tabs**: Cada clique em uma aba é registrado automaticamente
- **Tempo de Permanência**: O sistema rastreia quanto tempo o usuário permanece em cada aba
- **Sessões**: Cada vez que o usuário acessa uma aba, uma sessão é iniciada e finalizada quando ele sai

### 2. Armazenamento de Dados

- Os dados são armazenados localmente no navegador usando `localStorage`
- Os dados persistem entre sessões do navegador
- Limite automático de armazenamento para evitar problemas de espaço
- Sessões ativas são contabilizadas mesmo que não tenham sido finalizadas explicitamente

### 3. Visualização de Estatísticas

O componente `AnalyticsView` exibe:

- **Estatísticas Gerais**:
  - Total de cliques em todas as abas
  - Tempo total de uso
  - Data do primeiro e último registro

- **Estatísticas por Aba**:
  - Número de cliques
  - Tempo total de permanência
  - Número de sessões
  - Tempo médio por sessão
  - Percentuais de uso (cliques e tempo)

- **Filtros**:
  - Visualização por período (1 dia, 7 dias, 30 dias, 90 dias, 1 ano, ou todo o histórico)

### 4. Exportação de Dados

- Exportação dos dados em formato JSON
- Inclui dados brutos e estatísticas processadas
- Útil para backup ou análise externa

## Como Usar

### Acessar as Estatísticas

1. No Dashboard, clique no botão **"📊 Estatísticas"** no cabeçalho
2. Uma janela modal será aberta com todas as estatísticas
3. Use o filtro de período para visualizar dados de diferentes intervalos
4. Clique em "Fechar" ou fora da janela para fechar

### Exportar Dados

1. Abra a visualização de estatísticas
2. Clique no botão **"Exportar Dados (JSON)"**
3. Um arquivo JSON será baixado com todos os dados

### Limpar Dados

1. Abra a visualização de estatísticas
2. Clique no botão **"Limpar Dados"**
3. Confirme a ação
4. Todos os dados de analytics serão removidos

## Arquitetura Técnica

### Arquivos Criados

1. **`frontend/src/services/analytics.js`**
   - Serviço principal de analytics
   - Funções para rastrear eventos e gerenciar dados
   - Funções para calcular estatísticas

2. **`frontend/src/components/AnalyticsView.jsx`**
   - Componente React para visualização das estatísticas
   - Interface completa com gráficos e métricas
   - Modal integrado no Dashboard

### Integrações

- **`AdminContext.jsx`**: Integrado para rastrear mudanças de tab automaticamente
- **`Dashboard.jsx`**: Adicionado botão para acessar estatísticas

## Métricas Coletadas

### Por Tab (Agendamentos, Pedidos, WhatsApp)

- **Cliques**: Quantas vezes a aba foi acessada
- **Tempo Total**: Soma de todo o tempo gasto na aba
- **Sessões**: Quantas vezes o usuário entrou na aba
- **Tempo Médio**: Tempo médio por sessão na aba

### Globais

- Total de cliques em todas as abas
- Tempo total de uso do sistema
- Data do primeiro evento registrado
- Data do último evento registrado

## Extensões Futuras

O sistema foi projetado para ser facilmente extensível. Possíveis melhorias:

1. **Backend Integration**: Enviar dados para um servidor
2. **Gráficos Visuais**: Adicionar gráficos de linha, barras, etc.
3. **Relatórios Agendados**: Gerar relatórios periódicos
4. **Métricas Adicionais**: 
   - Rastreamento de ações específicas (criar pedido, editar, etc.)
   - Rastreamento de erros
   - Análise de fluxo de navegação
5. **Dashboard Administrativo**: Visualização de analytics para múltiplos usuários
6. **Alertas**: Notificações quando padrões específicos são detectados

## Considerações de Privacidade

- Todos os dados são armazenados localmente no navegador
- Nenhum dado é enviado para servidores externos automaticamente
- O usuário tem controle total sobre os dados (visualizar, exportar, limpar)
- Os dados podem ser limpos a qualquer momento

## Notas Técnicas

- O sistema usa `localStorage` que tem limite de ~5-10MB dependendo do navegador
- Há um limite automático de 1000 eventos para prevenir problemas de espaço
- Sessões são finalizadas automaticamente quando:
  - O usuário muda de aba
  - O componente é desmontado
  - A página é fechada (evento `beforeunload`)
- O sistema é robusto e continua funcionando mesmo se o localStorage estiver cheio ou indisponível























