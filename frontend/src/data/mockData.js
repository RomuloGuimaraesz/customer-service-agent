/**
 * Mock data for demonstration purposes
 */
export const MOCK_DATA = {
  pedidos: [
    { 
      ID: 'BS-060126-0921', 
      Cliente: 'Bruna Santos',
      categoria: 'Pedido',
      descricao: 'Impressão Colorida - A4 - 50 páginas',
      itens: [
        {
          nome: 'Impressão Colorida A4',
          quantidade: 50,
          categoria: 'Serviço',
          tipo: 'Impressão Colorida',
          origem: 'Produção',
          valor: 25.00,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 25,00',
      Status: 'Concluído',
      Data: '06/01/2026',
      Observações: 'Retira após as 17:00',
      custo: 12.50,
      metodoPagamento: 'PIX',
      canalOrigem: 'WhatsApp',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 20,
      tempoPreparoMinutos: 20
    },
    { 
      ID: 'JM-060126-1130', 
      Cliente: 'João Mendes',
      categoria: 'Pedido',
      descricao: 'Xerox Frente - A4 - 200 páginas',
      itens: [
        {
          nome: 'Xerox Frente A4',
          quantidade: 200,
          categoria: 'Serviço',
          tipo: 'Xerox Frente',
          origem: 'Produção',
          valor: 20.00,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 20,00',
      Status: 'Concluído',
      Data: '06/01/2026',
      Observações: 'Retira após as 13:00',
      custo: 8.00,
      metodoPagamento: 'Dinheiro',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 30,
      tempoPreparoMinutos: 30
    },
    { 
      ID: 'GR-060126-1130', 
      Cliente: 'Giulia Ribeiro',
      categoria: 'Pedido',
      descricao: 'Xerox Frente e Verso - A4 - 20 páginas',
      itens: [
        {
          nome: 'Xerox Frente e Verso A4',
          quantidade: 20,
          categoria: 'Serviço',
          tipo: 'Xerox Frente e Verso',
          origem: 'Produção',
          valor: 2.50,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 2,50',
      Status: 'Concluído',
      Data: '06/01/2026',
      Observações: 'Retira após as 15:00',
      custo: 1.00,
      metodoPagamento: 'Cartão Débito',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 15,
      tempoPreparoMinutos: 15
    },
    { 
      ID: 'MC-070126-0900', 
      Cliente: 'Maria Clara',
      categoria: 'Pedido',
      descricao: 'Mouse Gamer RGB Logitech G502 X',
      itens: [
        {
          nome: 'Mouse Gamer RGB Logitech G502 X',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Periféricos Gamer',
          origem: 'Estoque',
          valor: 89.99,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 89,99',
      Status: 'Concluído',
      Data: '08/01/2026',
      Observações: 'Frete ABCDM',
      custo: 65.00,
      metodoPagamento: 'PIX',
      canalOrigem: 'WhatsApp',
      tipoEntrega: 'Entrega',
      metodoEntrega: 'Transportadora',
      enderecoEntrega: 'Endereço do cliente',
      taxaEntrega: 15.00,
      tempoEstimadoMinutos: 2880,
      tempoPreparoMinutos: 0
    },
    { 
      ID: 'PH-080126-1100', 
      Cliente: 'Pedro Henrique',
      categoria: 'Pedido',
      descricao: 'Encadernação Espiral Pequena - A4 - 80 páginas',
      itens: [
        {
          nome: 'Encadernação Espiral Pequena A4',
          quantidade: 80,
          categoria: 'Serviço',
          tipo: 'Encadernação Espiral',
          origem: 'Produção',
          valor: 25.00,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 25,00',
      Status: 'Concluído',
      Data: '08/01/2026',
      Observações: 'Capa dura verde',
      custo: 10.00,
      metodoPagamento: 'Cartão Crédito',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 60,
      tempoPreparoMinutos: 60
    },
    { 
      ID: 'LS-110126-1600', 
      Cliente: 'Larissa Silva',
      categoria: 'Pedido',
      descricao: 'Kit Teclado e Mouse sem fio',
      itens: [
        {
          nome: 'Kit Teclado e Mouse sem fio',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Periféricos Gamer',
          origem: 'Estoque',
          valor: 89.82,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 89,82',
      Status: 'Concluído',
      Data: '11/01/2026',
      Observações: 'Frete ABCDM',
      custo: 58.00,
      metodoPagamento: 'PIX',
      canalOrigem: 'Online',
      tipoEntrega: 'Entrega',
      metodoEntrega: 'Transportadora',
      enderecoEntrega: 'Endereço do cliente',
      taxaEntrega: 15.00,
      tempoEstimadoMinutos: 2880,
      tempoPreparoMinutos: 0
    },
    { 
      ID: 'AS-120126-1430', 
      Cliente: 'Ana Souza',
      categoria: 'Pedido',
      descricao: 'Impressão P&B - A4 - 150 páginas',
      itens: [
        {
          nome: 'Impressão P&B A4',
          quantidade: 150,
          categoria: 'Serviço',
          tipo: 'Impressão P&B',
          origem: 'Produção',
          valor: 15.00,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 15,00',
      Status: 'Concluído',
      Data: '12/01/2026',
      Observações: 'Retira após as 16:00',
      custo: 6.00,
      metodoPagamento: 'PIX',
      canalOrigem: 'WhatsApp',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 25,
      tempoPreparoMinutos: 25
    },
    { 
      ID: 'RF-130126-1000', 
      Cliente: 'Rafael Ferreira',
      categoria: 'Pedido',
      descricao: 'HD Externo Seagate 1TB USB 3.0',
      itens: [
        {
          nome: 'HD Externo Seagate 1TB USB 3.0',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Armazenamento',
          origem: 'Estoque',
          valor: 299.90,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 299,90',
      Status: 'Concluído',
      Data: '13/01/2026',
      Observações: 'Garantia 1 ano',
      custo: 220.00,
      metodoPagamento: 'Cartão Crédito',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 0,
      tempoPreparoMinutos: 0
    },
    { 
      ID: 'CM-140126-1530', 
      Cliente: 'Carla Mendes',
      categoria: 'Pedido',
      descricao: 'Xerox Frente - A4 - 500 páginas',
      itens: [
        {
          nome: 'Xerox Frente A4',
          quantidade: 500,
          categoria: 'Serviço',
          tipo: 'Xerox Frente',
          origem: 'Produção',
          valor: 40.00,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 40,00',
      Status: 'Concluído',
      Data: '14/01/2026',
      Observações: 'Retira após as 18:00',
      custo: 15.00,
      metodoPagamento: 'Dinheiro',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 45,
      tempoPreparoMinutos: 45
    },
    { 
      ID: 'LT-150126-0900', 
      Cliente: 'Lucas Torres',
      categoria: 'Pedido',
      descricao: 'Webcam Logitech C920 Full HD 1080p',
      itens: [
        {
          nome: 'Webcam Logitech C920 Full HD 1080p',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Acessórios',
          origem: 'Estoque',
          valor: 349.90,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 349,90',
      Status: 'Concluído',
      Data: '15/01/2026',
      Observações: 'Frete ABCDM',
      custo: 250.00,
      metodoPagamento: 'PIX',
      canalOrigem: 'Online',
      tipoEntrega: 'Entrega',
      metodoEntrega: 'Transportadora',
      enderecoEntrega: 'Endereço do cliente',
      taxaEntrega: 20.00,
      tempoEstimadoMinutos: 2880,
      tempoPreparoMinutos: 0
    },
    { 
      ID: 'JP-160126-1100', 
      Cliente: 'Juliana Pereira',
      categoria: 'Pedido',
      descricao: 'Encadernação Espiral Grande - A4 - 200 páginas',
      itens: [
        {
          nome: 'Encadernação Espiral Grande A4',
          quantidade: 200,
          categoria: 'Serviço',
          tipo: 'Encadernação Espiral',
          origem: 'Produção',
          valor: 45.00,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 45,00',
      Status: 'Concluído',
      Data: '16/01/2026',
      Observações: 'Capa transparente',
      custo: 18.00,
      metodoPagamento: 'Cartão Débito',
      canalOrigem: 'Telefone',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 90,
      tempoPreparoMinutos: 90
    },
    { 
      ID: 'BS-170126-1400', 
      Cliente: 'Bruno Silva',
      categoria: 'Pedido',
      descricao: 'Impressão Colorida - A3 - 30 páginas',
      itens: [
        {
          nome: 'Impressão Colorida A3',
          quantidade: 30,
          categoria: 'Serviço',
          tipo: 'Impressão Colorida',
          origem: 'Produção',
          valor: 45.00,
          status: 'Em processamento'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 45,00',
      Status: 'Em processamento',
      Data: '17/01/2026',
      Observações: 'Retira após as 15:00',
      custo: 20.00,
      metodoPagamento: 'Cartão Crédito',
      canalOrigem: 'WhatsApp',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 30,
      tempoPreparoMinutos: 30
    },
    { 
      ID: 'MR-180126-1200', 
      Cliente: 'Marcos Rocha',
      categoria: 'Pedido',
      descricao: 'SSD Kingston 256GB SATA III',
      itens: [
        {
          nome: 'SSD Kingston 256GB SATA III',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Armazenamento',
          origem: 'Estoque',
          valor: 189.90,
          status: 'Concluído'
        }
      ],
      totalItens: 1,
      Valor: 'R$ 189,90',
      Status: 'Concluído',
      Data: '18/01/2026',
      Observações: 'Instalação incluída',
      custo: 140.00,
      metodoPagamento: 'PIX',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 0,
      tempoPreparoMinutos: 0
    },
    { 
      ID: 'BS-190126-1000', 
      Cliente: 'Bruna Santos',
      categoria: 'Pedido',
      descricao: 'Impressão Colorida + Mouse Gamer',
      itens: [
        {
          nome: 'Impressão Colorida A4',
          quantidade: 50,
          categoria: 'Serviço',
          tipo: 'Impressão Colorida',
          origem: 'Produção',
          valor: 25.00,
          status: 'Concluído',
          prazoEntrega: '19/01/2026'
        },
        {
          nome: 'Mouse Gamer Logitech G502 X',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Periféricos Gamer',
          origem: 'Estoque',
          valor: 89.99,
          status: 'Pronto',
          prazoEntrega: '19/01/2026'
        }
      ],
      totalItens: 2,
      Valor: 'R$ 114,99',
      Status: 'Em processamento',
      Data: '19/01/2026',
      Observações: 'Retira impressão hoje e mouse amanhã',
      custo: 77.50,
      metodoPagamento: 'PIX',
      canalOrigem: 'WhatsApp',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 20,
      tempoPreparoMinutos: 20
    },
    { 
      ID: 'JM-200126-1430', 
      Cliente: 'João Mendes',
      categoria: 'Pedido',
      descricao: 'Xerox Frente + Encadernação + Capa',
      itens: [
        {
          nome: 'Xerox Frente A4',
          quantidade: 100,
          categoria: 'Serviço',
          tipo: 'Xerox Frente',
          origem: 'Produção',
          valor: 10.00,
          status: 'Concluído'
        },
        {
          nome: 'Encadernação Espiral Pequena A4',
          quantidade: 100,
          categoria: 'Serviço',
          tipo: 'Encadernação Espiral',
          origem: 'Produção',
          valor: 25.00,
          status: 'Em processamento'
        },
        {
          nome: 'Capa Transparente',
          quantidade: 1,
          categoria: 'Produto',
          tipo: 'Acessórios',
          origem: 'Estoque',
          valor: 5.00,
          status: 'Pronto'
        }
      ],
      totalItens: 3,
      Valor: 'R$ 40,00',
      Status: 'Em processamento',
      Data: '20/01/2026',
      Observações: 'Xerox pronto, encadernação em andamento',
      custo: 18.00,
      metodoPagamento: 'Dinheiro',
      canalOrigem: 'Presencial',
      tipoEntrega: 'Retirada',
      metodoEntrega: null,
      enderecoEntrega: null,
      taxaEntrega: 0,
      tempoEstimadoMinutos: 60,
      tempoPreparoMinutos: 60
    },
  ],
  agendamentos: [
    { ID: 'JCS-151225-1500', Cliente: 'João Carlos Silva', Serviço: 'Avaliação/Manutenção', Produto: 'Impressora Epson L1250', Descrição: 'Cliente relata problemas', Status: 'Agendado', Data: '15/12/2025 15:00', Observações: 'Trazer cabo' },
    { ID: 'AF-161225-0930', Cliente: 'Ana Ferreira', Serviço: 'Manutenção', Produto: 'Notebook Dell', Descrição: 'Tela piscando', Status: 'Em andamento', Data: '16/12/2025 09:30', Observações: 'Garantia' },
    { ID: 'RC-141225-1400', Cliente: 'Roberto Costa', Serviço: 'Limpeza', Produto: 'PC Desktop', Descrição: 'Limpeza preventiva', Status: 'Concluído', Data: '14/12/2025 14:00', Observações: 'Troca pasta térmica' },
    { ID: 'MT-171225-1000', Cliente: 'Mariana Torres', Serviço: 'Diagnóstico', Produto: 'Impressora HP', Descrição: 'Não puxa papel', Status: 'Agendado', Data: '17/12/2025 10:00', Observações: '-' },
    { ID: 'CS-131225-1130', Cliente: 'Carlos Souza', Serviço: 'Reparo', Produto: 'Notebook Lenovo', Descrição: 'Troca de teclado', Status: 'Aguardando peça', Data: '13/12/2025 11:30', Observações: 'Peça encomendada' },
  ],
  conversations: [
    {
      id: '5511999999999',
      phone: '5511999999999',
      name: 'João Silva',
      lastMessage: 'Olá, preciso de ajuda com meu pedido',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 2,
    },
    {
      id: '5511888888888',
      phone: '5511888888888',
      name: 'Maria Santos',
      lastMessage: 'Obrigada pela ajuda!',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 0,
    },
    {
      id: '5511777777777',
      phone: '5511777777777',
      name: 'Pedro Costa',
      lastMessage: 'Quando meu produto chega?',
      lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
      unreadCount: 1,
    },
  ],
  /**
   * Generate mock messages for a conversation
   * @param {Object} conversation - Conversation object (optional, for context)
   * @returns {Array} Array of mock messages
   */
  getMockMessages: (conversation) => [
    {
      id: '1',
      body: conversation?.lastMessage || 'Olá, preciso de ajuda',
      direction: 'incoming',
      fromMe: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '2',
      body: 'Claro! Como posso ajudar?',
      direction: 'outgoing',
      fromMe: true,
      timestamp: new Date(Date.now() - 7000000).toISOString(),
    },
    {
      id: '3',
      body: 'Meu pedido está atrasado. Pode verificar?',
      direction: 'incoming',
      fromMe: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};






