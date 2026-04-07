/**
 * CSV Data Loader for GovTech POC
 * Loads and parses CSV data from spreadsheets
 */

// CSV data from spreadsheets (hardcoded for POC)
// Schema matches Avecta AI - Atendimentos.csv
const ATENDIMENTOS_CSV = `ID,Status,Data,Hora,Nome,WhatsApp,Prioridade,Assunto,Descricao Completa
RG-06012026-0921,Concluido,06/01/2026,09:21:00,Rômulo Guimarães,992368100,Baixa,Limpeza do entulho da calçada da escola Fabio Eduardo Ramos Esquivel,RG-06012026-0921 Concluido 06/01/2026 09:21:00 Rômulo Guimarães 992368100 Baixa Limpeza do entulho da calçada da escola Fabio Eduardo Ramos Esquivel
JM-06012026-1130,Cancelado,06/01/2026,11:30:00,João Mendes,998877665,Moderada,Fios caidos em frente ao ponto de ônibus do ginásio poliesportivo de Diadema,JM-06012026-1130 Cancelado 06/01/2026 11:30:00 João Mendes 998877665 Moderada Fios caidos em frente ao ponto de ônibus do ginásio poliesportivo de Diadema
GR-06012026-1131,Concluido,06/01/2026,11:31:00,Giulia Ribeiro,998877667,Moderada,Problemas na iluminação das quadras da Av. Juarez Rios de Vasconselos,GR-06012026-1131 Concluido 06/01/2026 11:31:00 Giulia Ribeiro 998877667 Moderada Problemas na iluminação das quadras da Av. Juarez Rios de Vasconselos
RG-09022026-1100,Concluído,09/02/2026,11:00:00,Rômulo Guimarães,992368100,Moderada,Manutenção de postes de luz na Praça Lauro Michels,RG-09022026-1100 Concluído 09/02/2026 11:00:00 Rômulo Guimarães 992368100 Moderada Manutenção de postes de luz na Praça Lauro Michels`;

const PEDIDOS_CSV = `ID,Status,Data,Nome,Prioridade,Descricao
AR-12012026-1430,Protocolado,12/01/2026,Ana Rosa,Baixa,Reparo do Gira-gira na praça da quadra da Rua B
RF-13012026-1000,Protocolado,13/01/2026,Rafael Ferreira,Moderada,Manutenção asfáltica da travessa próximo a Rua Antônio Dias Adorno`;

// Schema matches Avecta AI - Agendamentos.csv (same rows as assets copy for POC fallback)
const AGENDAMENTOS_CSV = `ID,Status,Dia da Semana,Data,Hora,Nome,WhatsApp,Assunto,Descrição Completa
BW-07022026-1700,Agendado,Sábado,07/02/2026,15:30:00,Bruce Wayne,998877665,Instalação de farol de pedestre para travessia segura no cruzamento entre rua Orense e Salgado de Castro,BW-07022026-1700 Agendado 07/02/2026 15:30 Bruce Wayne 998877665 Instalação de farol de pedestre para travessia segura no cruzamento entre rua Orense e Salgado de Castro
RG-07022026-1500,Agendado,Sábado,07/02/2026,17:00:00,Rômulo Guimarães,992368100,Manutenção de postes de luz na Praça Lauro Michels,RG-07022026-1500 Agendado 07/02/2026 17:00 Rômulo Guimarães 992368100 Manutenção de postes de luz na Praça Lauro Michels
JV-08022026-1430,Agendado,Domingo,08/02/2026,14:30:00,João Vitor,992368100,Manutenção do espaço da Quadra na rua São Paulo,JV-08022026-1430 Agendado 08/02/2026 14:30:00 João Vitor 992368100 Manutenção do espaço da Quadra na rua São Paulo
LL-08022026-1530,Agendado,Domingo,08/02/2026,15:30:00,Luana Lia,952512474,Criar inventário de herança ,LL-08022026-1530 Agendado 08/02/2026 Domingo 15:30 Luana Lia 952512474 Criar inventário de herança 
MM-08022026-1630,Agendado,Domingo,08/02/2026,16:30:00,Marion Oliveira,952512474,Reunião com grupo de mulheres da terceira idade,MM-08022026-1630 Agendado 08/02/2026 Domingo 16:30 Marion Magela 952512474 Reunião com grupo de mulheres da terceira idade`;

const WHATSAPP_CSV = `ID,Status,Data,Nome,Prioridade,Descricao
CM-14012026-1530,Criado,14/01/2026,Carla Mendes,Moderada,Retirada de entulho na Rua Orense próximo ao posto Ipiranga
LT-15012026-0900,Criado,15/01/2026,Lucas Torres,Moderada,Reforma da quadra Cartu e da área de lazer ao entorno da Rua Mozart`;

/**
 * Parse CSV string into array of objects
 */
function parseCSV(csvString) {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    data.push(obj);
  }
  
  return data;
}

/**
 * Get all atendimentos data
 */
export function getAtendimentos() {
  return parseCSV(ATENDIMENTOS_CSV);
}

/**
 * Get all pedidos data
 */
export function getPedidos() {
  return parseCSV(PEDIDOS_CSV);
}

/**
 * Get all agendamentos data
 */
export function getAgendamentos() {
  return parseCSV(AGENDAMENTOS_CSV);
}

/**
 * Get all WhatsApp data
 */
export function getWhatsApp() {
  return parseCSV(WHATSAPP_CSV);
}

/**
 * Get stats for dashboard
 */
export function getDashboardStats() {
  const atendimentos = getAtendimentos();
  const agendamentos = getAgendamentos();
  const pedidos = getPedidos();
  const whatsapp = getWhatsApp();
  
  // Count today's items (mock - using items from 06/01/2026 as "today")
  const hoje = atendimentos.filter(a => a.Data === '06/01/2026').length;
  
  return {
    hoje,
    atendimentos: atendimentos.length,
    agendamentos: agendamentos.length,
    pedidos: pedidos.length,
    whatsapp: whatsapp.length,
  };
}




