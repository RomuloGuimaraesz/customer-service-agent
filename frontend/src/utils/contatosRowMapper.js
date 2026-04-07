/**
 * Mapeia linhas retornadas pelo GET admin-contatos (chaves estilo planilha)
 * para o formato dos campos do formulário principal e do modal "Mais informações".
 */

function cell(row, ...keys) {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== '') return String(v);
  }
  return '';
}

/**
 * Chave estável para seleção / React key (row_number da planilha quando existir).
 */
export function getContatoRowKey(row, listIndex) {
  const rn = row.row_number ?? row['row_number'];
  if (rn != null && String(rn).trim() !== '') return `rn-${rn}`;
  return `idx-${listIndex}`;
}

/**
 * @param {Record<string, unknown>} row
 * @returns {Record<string, string>} dadosPrincipais — mesmo formato que ContatosContactForm envia
 */
export function mapContatoRowToDadosPrincipais(row) {
  return {
    nome: cell(row, 'Nome', 'nome'),
    whatsapp: cell(row, 'WhatsApp', 'whatsapp'),
    dataNascimento: cell(row, 'Data de Nascimento', 'Data de nascimento'),
    idade: cell(row, 'Idade', 'idade'),
    cep: cell(row, 'CEP', 'cep'),
    cidade: cell(row, 'Cidade', 'cidade'),
    estado: cell(row, 'Estado', 'estado'),
    endereco: cell(row, 'Endereço', 'Endereco', 'endereco'),
    numero: cell(row, 'Número', 'Numero', 'numero'),
    complemento: cell(
      row,
      'Endereço/Complemento',
      'Endereco/Complemento',
      'complemento',
    ),
    bairro: cell(row, 'Bairro', 'bairro'),
    bairroComplemento: cell(
      row,
      'Bairro/Complemento',
      'bairroComplemento',
    ),
  };
}

/**
 * @param {Record<string, unknown>} row
 * @returns {{ indicacao: string, categoria: string, cpf: string, tituloEleitor: string, zonaEleitoral: string, secaoEleitoral: string }}
 */
export function mapContatoRowToMaisInfoValues(row) {
  return {
    indicacao: cell(row, 'Indicação', 'Indicacao', 'indicacao'),
    categoria: cell(row, 'Categoria', 'categoria'),
    cpf: cell(row, 'CPF', 'cpf'),
    tituloEleitor: cell(
      row,
      'Título de Eleitor',
      'Titulo de Eleitor',
      'tituloEleitor',
    ),
    zonaEleitoral: cell(row, 'Zona Eleitoral', 'zonaEleitoral'),
    secaoEleitoral: cell(row, 'Seção Eleitoral', 'Secao Eleitoral', 'secaoEleitoral'),
  };
}
