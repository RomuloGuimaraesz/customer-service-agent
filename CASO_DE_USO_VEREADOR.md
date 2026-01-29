# Sistema de Gestão de Atendimento ao Munícipe
## Caso de Uso: Gabinete Parlamentar de Vereador

---

**Versão:** 1.0  
**Data:** Janeiro 2026  
**Autor:** Equipe de Desenvolvimento  
**Status:** Proposta de Implementação

---

## 1. Sumário Executivo

Este documento apresenta a proposta de implementação de um sistema de gestão de atendimento ao munícipe para gabinetes parlamentares, utilizando uma plataforma SaaS generalista adaptada para atender às necessidades específicas de vereadores e suas equipes de assessoria.

O sistema permite o gerenciamento completo de solicitações, pedidos e demandas dos munícipes, desde o registro inicial até a conclusão, proporcionando transparência, rastreabilidade e eficiência no atendimento público.

---

## 2. Contexto e Necessidade

### 2.1 Desafios Atuais

Os gabinetes parlamentares enfrentam diversos desafios no atendimento aos munícipes:

- **Volume de demandas**: Um vereador pode receber centenas de solicitações mensais
- **Diversidade de pedidos**: Desde serviços públicos (limpeza, iluminação, pavimentação) até produtos (material de construção, equipamentos)
- **Rastreabilidade**: Necessidade de acompanhar o status de cada solicitação
- **Transparência**: Exigência de prestação de contas à população
- **Multiplicidade de canais**: WhatsApp, presencial, telefone, redes sociais
- **Baixa escolaridade**: Muitos assessores e munícipes possuem baixa escolaridade, necessitando de interface simples

### 2.2 Objetivos da Solução

- Centralizar todas as solicitações em um único sistema
- Facilitar o acompanhamento do status de cada demanda
- Melhorar a comunicação com os munícipes
- Gerar relatórios para prestação de contas
- Reduzir tempo de resposta e aumentar a eficiência
- Interface simples e intuitiva para todos os níveis de escolaridade

---

## 3. Caso de Uso: Atendimento de Solicitações de Munícipes

### 3.1 Personas

**Persona Principal: Assessor Parlamentar**
- Responsável por receber e processar solicitações
- Nível de escolaridade variado (ensino médio a superior)
- Necessita de sistema simples e rápido
- Trabalha com múltiplos canais de comunicação

**Persona Secundária: Vereador**
- Precisa de visão geral e relatórios
- Necessita acompanhar demandas prioritárias
- Requer dados para prestação de contas

**Persona Terciária: Munícipe**
- Faz solicitações via WhatsApp, presencial ou telefone
- Precisa de retorno sobre o status de sua solicitação
- Busca transparência e agilidade

### 3.2 Fluxo de Atendimento

#### 3.2.1 Recebimento da Solicitação

**Cenário 1: Solicitação de Serviço Público**

*Munícipe solicita via WhatsApp:*
> "Boa tarde, vereador. Preciso de ajuda com a limpeza da rua onde moro. Tem muito lixo acumulado."

**Ação do Assessor:**
1. Acessa o sistema via WhatsApp integrado
2. Cria novo pedido com os dados do munícipe
3. Registra:
   - **Cliente**: Nome do munícipe
   - **Categoria**: Pedido
   - **Itens**:
     - Item 1: Limpeza de Rua
       - Categoria: Serviço
       - Tipo: Limpeza Pública
       - Origem: Produção (será executado pela prefeitura)
       - Quantidade: 1
       - Valor: R$ 0,00 (serviço público)
   - **Status**: Em processamento
   - **Canal de Origem**: WhatsApp
   - **Tipo de Entrega**: Presencial (serviço no local)
   - **Endereço**: Rua do munícipe
   - **Observações**: "Lixo acumulado, urgente"

#### 3.2.2 Solicitação Mista (Serviço + Produto)

**Cenário 2: Solicitação Completa**

*Munícipe solicita presencialmente:*
> "Preciso de ajuda para iluminar a rua e também preciso de material para fazer uma calçada."

**Ação do Assessor:**
1. Cria pedido único com múltiplos itens:
   - **Item 1**: Instalação de Iluminação Pública
     - Categoria: Serviço
     - Tipo: Iluminação Pública
     - Origem: Produção
     - Status: Em processamento
   
   - **Item 2**: Material de Construção (Cimento)
     - Categoria: Produto
     - Tipo: Material de Construção
     - Origem: Estoque (já disponível no almoxarifado)
     - Quantidade: 5 sacos
     - Status: Pronto
   
   - **Item 3**: Material de Construção (Areia)
     - Categoria: Produto
     - Tipo: Material de Construção
     - Origem: Estoque
     - Quantidade: 1 metro cúbico
     - Status: Pronto

2. Sistema calcula automaticamente:
   - Total de itens: 3 tipos diferentes
   - Status geral: Em processamento (um item em produção)
   - Valor total: Soma dos valores individuais

#### 3.2.3 Acompanhamento e Atualização

**Cenário 3: Atualização de Status**

1. Assessor acompanha pedidos em processamento
2. Quando serviço é executado pela prefeitura:
   - Atualiza status do item para "Concluído"
   - Sistema atualiza status geral do pedido
3. Munícipe recebe notificação automática via WhatsApp

---

## 4. Estrutura de Dados Adaptada para o Contexto

### 4.1 Exemplo de Pedido Completo

```json
{
  "ID": "VR-150126-0930",
  "Cliente": "Maria Silva",
  "categoria": "Pedido",
  "descricao": "Limpeza de Rua + Material de Construção",
  "itens": [
    {
      "nome": "Limpeza de Rua - Rua das Flores",
      "quantidade": 1,
      "categoria": "Serviço",
      "tipo": "Limpeza Pública",
      "origem": "Produção",
      "valor": 0.00,
      "status": "Concluído",
      "prazoEntrega": "20/01/2026"
    },
    {
      "nome": "Cimento",
      "quantidade": 5,
      "categoria": "Produto",
      "tipo": "Material de Construção",
      "origem": "Estoque",
      "valor": 150.00,
      "status": "Pronto"
    }
  ],
  "totalItens": 2,
  "Valor": "R$ 150,00",
  "Status": "Em processamento",
  "Data": "15/01/2026",
  "Observações": "Urgente - Rua com muito lixo acumulado",
  "custo": 120.00,
  "metodoPagamento": "Doação",
  "canalOrigem": "WhatsApp",
  "tipoEntrega": "Presencial",
  "metodoEntrega": "Equipe Prefeitura",
  "enderecoEntrega": "Rua das Flores, 123 - Bairro Centro",
  "taxaEntrega": 0,
  "tempoEstimadoMinutos": 1440,
  "tempoPreparoMinutos": 0
}
```

### 4.2 Categorias de Itens Comuns

**Serviços (Origem: Produção)**
- Limpeza Pública
- Iluminação Pública
- Pavimentação
- Podas de Árvores
- Manutenção de Praças
- Coleta de Lixo
- Drenagem
- Sinalização

**Produtos (Origem: Estoque)**
- Material de Construção
- Equipamentos
- Medicamentos (farmácia popular)
- Alimentos (cestas básicas)
- Material Escolar
- Material de Limpeza

---

## 5. Funcionalidades Principais

### 5.1 Gestão de Pedidos

- **Criação**: Registro rápido via múltiplos canais
- **Rastreamento**: Acompanhamento em tempo real do status
- **Atualização**: Modificação de status e informações
- **Visualização**: Modal com detalhes completos ao clicar

### 5.2 Relatórios e Analytics

**Relatórios Disponíveis:**

1. **Relatório de Atendimentos por Período**
   - Total de solicitações recebidas
   - Taxa de conclusão
   - Tempo médio de resposta

2. **Análise por Tipo de Solicitação**
   - Serviços mais demandados
   - Produtos mais solicitados
   - Identificação de padrões

3. **Análise por Canal de Origem**
   - WhatsApp vs Presencial vs Telefone
   - Eficiência por canal
   - Preferências dos munícipes

4. **Análise por Bairro/Região**
   - Distribuição geográfica das demandas
   - Identificação de áreas prioritárias

5. **Status de Execução**
   - Pedidos concluídos
   - Em processamento
   - Pendentes
   - Taxa de sucesso

6. **Análise de Custos**
   - Custo por tipo de serviço/produto
   - Margem de doações
   - Eficiência de recursos

### 5.3 Integração com WhatsApp

- Recebimento automático de mensagens
- Criação de pedidos diretamente do chat
- Notificações automáticas de status
- Comunicação bidirecional com munícipes

### 5.4 Interface Simplificada

- Design intuitivo para baixa escolaridade
- Ícones e cores para facilitar compreensão
- Navegação simples
- Termos claros e objetivos

---

## 6. Benefícios Esperados

### 6.1 Para o Gabinete

- **Organização**: Centralização de todas as demandas
- **Eficiência**: Redução de tempo de processamento
- **Transparência**: Rastreabilidade completa
- **Relatórios**: Dados para prestação de contas
- **Produtividade**: Aumento na capacidade de atendimento

### 6.2 Para os Munícipes

- **Agilidade**: Respostas mais rápidas
- **Transparência**: Acompanhamento do status
- **Acessibilidade**: Múltiplos canais de comunicação
- **Confiança**: Sistema profissional e organizado

### 6.3 Para a Gestão Pública

- **Dados**: Informações para planejamento
- **Eficiência**: Melhor uso de recursos
- **Controle**: Acompanhamento de execução
- **Prestação de Contas**: Relatórios detalhados

---

## 7. Exemplos Práticos de Uso

### 7.1 Caso 1: Limpeza de Rua Urgente

**Situação:**
Munícipe reporta acúmulo de lixo em via pública, risco de saúde.

**Fluxo:**
1. Assessor recebe via WhatsApp
2. Cria pedido: "Limpeza Urgente - Rua X"
3. Origem: Produção (prefeitura executará)
4. Status: Em processamento
5. Sistema notifica equipe de limpeza
6. Após execução, status atualizado para "Concluído"
7. Munícipe recebe confirmação automática

**Resultado:**
- Tempo de resposta: 24 horas
- Satisfação do munícipe: Alta
- Rastreabilidade: Completa

### 7.2 Caso 2: Doação de Material de Construção

**Situação:**
Família necessita material para reforma de casa.

**Fluxo:**
1. Solicitação presencial
2. Pedido criado com múltiplos itens:
   - Cimento (Estoque)
   - Tijolos (Estoque)
   - Telhas (Produção - será encomendado)
3. Itens em estoque: Status "Pronto"
4. Item em produção: Status "Em processamento"
5. Entrega agendada
6. Status geral: "Em processamento"

**Resultado:**
- Transparência total do processo
- Cliente informado sobre cada item
- Controle de estoque integrado

### 7.3 Caso 3: Solicitação Mista Complexa

**Situação:**
Comunidade solicita: iluminação + limpeza + material para reforma de praça.

**Fluxo:**
1. Pedido único com 3 itens diferentes
2. Cada item com status independente
3. Acompanhamento granular
4. Status geral reflete progresso total
5. Relatório consolidado para prestação de contas

**Resultado:**
- Organização de demandas complexas
- Rastreabilidade individual
- Visão consolidada

---

## 8. Métricas de Sucesso

### 8.1 KPIs Propostos

1. **Tempo Médio de Resposta**
   - Meta: < 24 horas para urgências
   - Meta: < 72 horas para normais

2. **Taxa de Conclusão**
   - Meta: > 85% dos pedidos concluídos

3. **Satisfação do Munícipe**
   - Meta: > 80% de satisfação

4. **Eficiência Operacional**
   - Meta: Redução de 30% no tempo de processamento

5. **Transparência**
   - Meta: 100% dos pedidos rastreáveis

---

## 9. Considerações Técnicas

### 9.1 Estrutura de Dados Generalista

O sistema utiliza uma estrutura flexível que permite:

- **Múltiplos itens por pedido**: Um pedido pode conter vários serviços e produtos
- **Origem diferenciada**: Distingue entre itens em estoque e itens que serão produzidos/executados
- **Status granular**: Cada item pode ter status independente
- **Categorização flexível**: Adaptável a diferentes tipos de negócios/serviços

### 9.2 Compatibilidade Retroativa

O sistema mantém compatibilidade com estruturas antigas, permitindo migração gradual sem quebrar funcionalidades existentes.

### 9.3 Escalabilidade

A arquitetura permite:
- Crescimento do volume de pedidos
- Adição de novos tipos de itens
- Integração com outros sistemas
- Expansão para outros gabinetes

---

## 10. Próximos Passos

### 10.1 Fase 1: Implementação Inicial (Mês 1)
- Configuração do sistema
- Treinamento da equipe
- Migração de dados existentes
- Testes com casos reais

### 10.2 Fase 2: Expansão (Mês 2-3)
- Integração completa com WhatsApp
- Implementação de relatórios avançados
- Otimizações baseadas em feedback

### 10.3 Fase 3: Otimização (Mês 4+)
- Análise de métricas
- Melhorias contínuas
- Expansão para outros gabinetes

---

## 11. Conclusão

O sistema de gestão de atendimento ao munícipe proposto oferece uma solução completa, flexível e intuitiva para gabinetes parlamentares, permitindo:

- Organização eficiente de demandas
- Transparência e rastreabilidade
- Comunicação eficaz com munícipes
- Geração de relatórios para prestação de contas
- Interface acessível para todos os níveis de escolaridade

A estrutura generalista do sistema permite adaptação a diferentes contextos, mantendo a simplicidade e eficiência necessárias para o atendimento público de qualidade.

---

## 12. Anexos

### 12.1 Glossário

- **Pedido**: Solicitação completa de um munícipe
- **Item**: Componente individual de um pedido (serviço ou produto)
- **Origem**: Classificação que indica se item está em estoque ou será produzido
- **Status**: Estado atual do pedido ou item
- **Canal de Origem**: Meio pelo qual a solicitação foi recebida

### 12.2 Referências

- Documentação técnica do sistema
- Manual do usuário
- Guia de boas práticas
- Políticas de privacidade e LGPD

---

**Documento elaborado para apresentação de feature de atendimento ao munícipe**  
**Sistema SaaS Generalista - Versão 1.0**

