/**
 * Mock data for demonstration purposes
 * Pedidos structure from Avecta AI - Pedidos.csv
 * Agendamentos structure from Avecta AI - Agendamentos.csv
 */
export const MOCK_DATA = {
  pedidos: [
    {
      ID: 'BW-09022026-1000',
      Status: 'Em andamento',
      Data: '09/02/2026',
      Hora: '10:00:00',
      Nome: 'Bruce Wayne',
      WhatsApp: '998877665',
      Prioridade: 'Baixa',
      Assunto: 'Instalação de farol de pedestre para travessia segura no cruzamento entre rua Orense e Salgado de Castro',
      'Descricao Completa': 'BW-09022026-1700 Em andamento 09/02/2026 Bruce Wayne 998877665 Baixa Instalação de farol de pedestre para travessia segura no cruzamento entre rua Orense e Salgado de Castro',
    },
    {
      ID: 'RG-09022026-1100',
      Status: 'Concluído',
      Data: '09/02/2026',
      Hora: '11:00:00',
      Nome: 'Rômulo Guimarães',
      WhatsApp: '992368100',
      Prioridade: 'Moderada',
      Assunto: 'Manutenção de postes de luz na Praça Lauro Michels',
      'Descricao Completa': 'RG-09022026-1100 Concluído 09/02/2026 11:00:00 Rômulo Guimarães 992368100 Moderada Manutenção de postes de luz na Praça Lauro Michels',
    },
  ],
  atendimentos: [
    { ID: 'RG-06012026-0921', Status: 'Concluido', Data: '06/01/2026', Hora: '09:21:00', Nome: 'Rômulo Guimarães', WhatsApp: '992368100', Prioridade: 'Baixa', Assunto: 'Limpeza do entulho da calçada da escola Fabio Eduardo Ramos Esquivel', 'Descricao Completa': 'RG-06012026-0921 Concluido 06/01/2026 09:21:00 Rômulo Guimarães 992368100 Baixa Limpeza do entulho da calçada da escola Fabio Eduardo Ramos Esquivel' },
    { ID: 'JM-06012026-1130', Status: 'Cancelado', Data: '06/01/2026', Hora: '11:30:00', Nome: 'João Mendes', WhatsApp: '998877665', Prioridade: 'Moderada', Assunto: 'Fios caidos em frente ao ponto de ônibus do ginásio poliesportivo de Diadema', 'Descricao Completa': 'JM-06012026-1130 Cancelado 06/01/2026 11:30:00 João Mendes 998877665 Moderada Fios caidos em frente ao ponto de ônibus do ginásio poliesportivo de Diadema' },
    { ID: 'GR-06012026-1131', Status: 'Concluido', Data: '06/01/2026', Hora: '11:31:00', Nome: 'Giulia Ribeiro', WhatsApp: '998877667', Prioridade: 'Moderada', Assunto: 'Problemas na iluminação das quadras da Av. Juarez Rios de Vasconselos', 'Descricao Completa': 'GR-06012026-1131 Concluido 06/01/2026 11:31:00 Giulia Ribeiro 998877667 Moderada Problemas na iluminação das quadras da Av. Juarez Rios de Vasconselos' },
    { ID: 'RG-09022026-1100', Status: 'Concluído', Data: '09/02/2026', Hora: '11:00:00', Nome: 'Rômulo Guimarães', WhatsApp: '992368100', Prioridade: 'Moderada', Assunto: 'Manutenção de postes de luz na Praça Lauro Michels', 'Descricao Completa': 'RG-09022026-1100 Concluído 09/02/2026 11:00:00 Rômulo Guimarães 992368100 Moderada Manutenção de postes de luz na Praça Lauro Michels' },
  ],
  agendamentos: [
    { ID: 'BW-07022026-1700', Status: 'Agendado', 'Dia da Semana': 'Sábado', Data: '07/02/2026', Hora: '15:30:00', Nome: 'Bruce Wayne', WhatsApp: '998877665', Assunto: 'Instalação de farol de pedestre para travessia segura no cruzamento entre rua Orense e Salgado de Castro', 'Descrição Completa': 'BW-07022026-1700 Agendado 07/02/2026 15:30 Bruce Wayne 998877665 Instalação de farol de pedestre para travessia segura no cruzamento entre rua Orense e Salgado de Castro' },
    { ID: 'RG-07022026-1500', Status: 'Agendado', 'Dia da Semana': 'Sábado', Data: '07/02/2026', Hora: '17:00:00', Nome: 'Rômulo Guimarães', WhatsApp: '992368100', Assunto: 'Manutenção de postes de luz na Praça Lauro Michels', 'Descrição Completa': 'RG-07022026-1500 Agendado 07/02/2026 17:00 Rômulo Guimarães 992368100 Manutenção de postes de luz na Praça Lauro Michels' },
    { ID: 'JV-08022026-1430', Status: 'Agendado', 'Dia da Semana': 'Domingo', Data: '08/02/2026', Hora: '14:30:00', Nome: 'João Vitor', WhatsApp: '992368100', Assunto: 'Manutenção do espaço da Quadra na rua São Paulo', 'Descrição Completa': 'JV-08022026-1430 Agendado 08/02/2026 14:30:00 João Vitor 992368100 Manutenção do espaço da Quadra na rua São Paulo' },
    { ID: 'LL-08022026-1530', Status: 'Agendado', 'Dia da Semana': 'Domingo', Data: '08/02/2026', Hora: '15:30:00', Nome: 'Luana Lia', WhatsApp: '952512474', Assunto: 'Criar inventário de herança ', 'Descrição Completa': 'LL-08022026-1530 Agendado 08/02/2026 Domingo 15:30 Luana Lia 952512474 Criar inventário de herança ' },
    { ID: 'MM-08022026-1630', Status: 'Agendado', 'Dia da Semana': 'Domingo', Data: '08/02/2026', Hora: '16:30:00', Nome: 'Marion Oliveira', WhatsApp: '952512474', Assunto: 'Reunião com grupo de mulheres da terceira idade', 'Descrição Completa': 'MM-08022026-1630 Agendado 08/02/2026 Domingo 16:30 Marion Magela 952512474 Reunião com grupo de mulheres da terceira idade' },
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






