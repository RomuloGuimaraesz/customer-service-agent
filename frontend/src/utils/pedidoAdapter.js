/**
 * Formats itens array into a readable description
 * @param {Array} itens - Array of itens
 * @returns {string} Formatted description
 */
export const formatItensDescription = (itens) => {
  if (!itens || itens.length === 0) return '-';
  
  if (itens.length === 1) {
    const item = itens[0];
    return `${item.nome}${item.quantidade > 1 ? ` (x${item.quantidade})` : ''}`;
  }
  
  // Multiple itens: show first item + count
  const firstItem = itens[0];
  const totalItems = itens.reduce((sum, item) => sum + item.quantidade, 0);
  return `${firstItem.nome}${itens.length > 1 ? ` + ${itens.length - 1} mais` : ''} (${totalItems} itens)`;
};

/**
 * Adapts pedido data to display format (supports both old and new structure)
 * @param {Object} pedido - Pedido object (old or new structure)
 * @returns {Object} Adapted pedido for display
 */
export const adaptPedidoForDisplay = (pedido) => {
  // Check if it's the new structure (has 'itens' array)
  if (pedido.itens && Array.isArray(pedido.itens)) {
    // New structure: adapt to display format
    return {
      ID: pedido.ID,
      Cliente: pedido.Cliente,
      Valor: pedido.Valor,
      Status: pedido.Status,
      Data: pedido.Data,
      Descrição: pedido.descricao || pedido.Descrição || formatItensDescription(pedido.itens),
      // Keep original for compatibility
      ...pedido
    };
  }
  // Old structure: return as-is (backward compatibility)
  return pedido;
};








