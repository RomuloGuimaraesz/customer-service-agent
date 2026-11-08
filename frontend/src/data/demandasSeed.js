/**
 * Dados do protótipo /demanda — tudo fictício, nada de pessoa real.
 */

export const DIADEMA_BAIRROS = [
  'Campanário',
  'Canhema',
  'Casa Grande',
  'Centro',
  'Conceição',
  'Eldorado',
  'Inamar',
  'Piraporinha',
  'Serraria',
  'Taboão',
  'Vila Nogueira',
];

export const DEMANDA_CATEGORIAS = [
  'Saúde',
  'Educação',
  'Zeladoria',
  'Assistência',
  'Transporte',
  'Outro',
];

export const DEMANDA_STATUS = {
  ABERTA: 'aberta',
  ENCAMINHADA: 'encaminhada',
  RESOLVIDA: 'resolvida',
};

const DAY_MS = 24 * 60 * 60 * 1000;

const SEED_ROWS = [
  { nome: 'Ana Exemplo', whatsapp: '11911111111', bairro: 'Centro', categoria: 'Zeladoria', descricao: 'Buraco grande na calçada em frente à praça.', diasAtras: 1, status: DEMANDA_STATUS.ABERTA },
  { nome: 'Bruno Fictício', whatsapp: '11922222222', bairro: 'Serraria', categoria: 'Saúde', descricao: 'Pede informação sobre horário da UBS aos sábados.', diasAtras: 2, status: DEMANDA_STATUS.ABERTA },
  { nome: 'Carla Demonstração', whatsapp: '', bairro: 'Eldorado', categoria: 'Transporte', descricao: 'Ponto de ônibus sem cobertura, idosos tomando chuva.', diasAtras: 3, status: DEMANDA_STATUS.ENCAMINHADA },
  { nome: 'Daniel Teste', whatsapp: '11933333333', bairro: 'Piraporinha', categoria: 'Educação', descricao: 'Falta de vaga em creche para filho de 2 anos.', diasAtras: 4, status: DEMANDA_STATUS.ABERTA },
  { nome: 'Elisa Modelo', whatsapp: '11944444444', bairro: 'Taboão', categoria: 'Zeladoria', descricao: 'Lâmpada do poste queimada há duas semanas.', diasAtras: 5, status: DEMANDA_STATUS.RESOLVIDA },
  { nome: 'Fábio Simulado', whatsapp: '', bairro: 'Canhema', categoria: 'Assistência', descricao: 'Família precisa de orientação sobre cesta básica.', diasAtras: 7, status: DEMANDA_STATUS.ENCAMINHADA },
  { nome: 'Gabriela Amostra', whatsapp: '11955555555', bairro: 'Conceição', categoria: null, descricao: '', diasAtras: 8, status: DEMANDA_STATUS.ABERTA },
  { nome: 'Heitor Protótipo', whatsapp: '11966666666', bairro: 'Inamar', categoria: 'Saúde', descricao: 'Remédio de uso contínuo em falta na farmácia popular.', diasAtras: 10, status: DEMANDA_STATUS.RESOLVIDA },
  { nome: 'Íris Fantasia', whatsapp: '11977777777', bairro: 'Casa Grande', categoria: 'Outro', descricao: 'Barulho de bar até de madrugada na rua de casa.', diasAtras: 12, status: DEMANDA_STATUS.ENCAMINHADA },
  { nome: 'João Inventado', whatsapp: '', bairro: 'Campanário', categoria: 'Zeladoria', descricao: 'Entulho descartado em terreno baldio.', diasAtras: 14, status: DEMANDA_STATUS.RESOLVIDA },
  { nome: 'Karina Exemplar', whatsapp: '11988888888', bairro: 'Vila Nogueira', categoria: 'Transporte', descricao: 'Pede faixa de pedestre perto da escola.', diasAtras: 17, status: DEMANDA_STATUS.ABERTA },
  { nome: 'Luís Hipotético', whatsapp: '11999999999', bairro: 'Centro', categoria: 'Educação', descricao: 'Quadra da escola estadual sem manutenção.', diasAtras: 20, status: DEMANDA_STATUS.RESOLVIDA },
];

/**
 * 12 demandas sintéticas, datas relativas a `now` (1 a 20 dias atrás).
 * @param {number} [now=Date.now()]
 */
export function buildDemandasSeed(now = Date.now()) {
  return SEED_ROWS.map(({ diasAtras, ...row }, idx) => ({
    id: `seed-${String(idx + 1).padStart(2, '0')}`,
    ...row,
    criadaEm: new Date(now - diasAtras * DAY_MS).toISOString(),
  }));
}
