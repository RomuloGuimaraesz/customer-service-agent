/**
 * Mock data for demonstration purposes
 */
export const MOCK_DATA = {
  pedidos: [
    { ID: 'BS-151225-0921', Cliente: 'Bruna Santos', Serviço: 'Impressão', Produto: '-', Descrição: 'Impressão Colorida - A4 - 50 páginas', Valor: 'R$ 25,00', Retira: 'Hoje', Status: 'Confirmado', Data: '15/12/2025', Observações: '-' },
    { ID: 'JM-141225-1430', Cliente: 'João Mendes', Serviço: 'Xerox', Produto: '-', Descrição: 'Xerox P&B - 200 páginas', Valor: 'R$ 20,00', Retira: '16/12', Status: 'Pronto', Data: '14/12/2025', Observações: 'Cliente VIP' },
    { ID: 'MC-131225-0900', Cliente: 'Maria Clara', Serviço: '-', Produto: 'Mouse Gamer', Descrição: 'Mouse Gamer RGB Logitech G502 X', Valor: 'R$ 89,99', Retira: 'Entrega', Status: 'Enviado', Data: '13/12/2025', Observações: 'Frete ABCDM' },
    { ID: 'PH-121225-1100', Cliente: 'Pedro Henrique', Serviço: 'Encadernação', Produto: '-', Descrição: 'Encadernação espiral - TCC 80 páginas', Valor: 'R$ 15,00', Retira: 'Hoje', Status: 'Em produção', Data: '12/12/2025', Observações: 'Capa dura azul' },
    { ID: 'LS-111225-1600', Cliente: 'Larissa Silva', Serviço: '-', Produto: 'Teclado + Mouse', Descrição: 'Kit Teclado e Mouse sem fio', Valor: 'R$ 89,82', Retira: 'Retirada', Status: 'Aguardando', Data: '11/12/2025', Observações: 'Combo promocional' },
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






