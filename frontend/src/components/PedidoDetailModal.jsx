import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';

/**
 * Modal Header - BEM: pedido-detail-modal__header
 */
const StyledModalHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Modal Title - BEM: pedido-detail-modal__title
 */
const StyledModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

/**
 * Close Button - BEM: pedido-detail-modal__close-button
 */
const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSize['2xl']};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  line-height: 1;
  transition: color ${props => props.theme.transitions.fast} ease;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

/**
 * Modal Body - BEM: pedido-detail-modal__body
 */
const StyledModalBody = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

/**
 * Detail Section - BEM: pedido-detail-modal__section
 */
const StyledSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Section Title - BEM: pedido-detail-modal__section-title
 */
const StyledSectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

/**
 * Detail Grid - BEM: pedido-detail-modal__grid
 */
const StyledDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Detail Item - BEM: pedido-detail-modal__detail-item
 */
const StyledDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

/**
 * Detail Label - BEM: pedido-detail-modal__detail-label
 */
const StyledDetailLabel = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Detail Value - BEM: pedido-detail-modal__detail-value
 */
const StyledDetailValue = styled.span`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Itens List - BEM: pedido-detail-modal__itens-list
 */
const StyledItensList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Item Card - BEM: pedido-detail-modal__item-card
 */
const StyledItemCard = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Item Header - BEM: pedido-detail-modal__item-header
 */
const StyledItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

/**
 * Item Name - BEM: pedido-detail-modal__item-name
 */
const StyledItemName = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Item Value - BEM: pedido-detail-modal__item-value
 */
const StyledItemValue = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Item Details - BEM: pedido-detail-modal__item-details
 */
const StyledItemDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Item Detail Badge - BEM: pedido-detail-modal__item-badge
 */
const StyledItemBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Format currency value
 */
const formatCurrency = (value) => {
  if (typeof value === 'string' && value.includes('R$')) {
    return value;
  }
  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  return value || '-';
};

/**
 * Format date
 */
const formatDate = (date) => {
  if (!date) return '-';
  return date;
};

/**
 * Pedido Detail Modal Component
 * Displays complete pedido information in a modal
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 * @param {Object} props.pedido - Pedido object to display
 */
export const PedidoDetailModal = ({ isOpen, onClose, pedido }) => {
  if (!pedido) return null;

  // Check if it's new structure (has itens array)
  const hasItens = pedido.itens && Array.isArray(pedido.itens) && pedido.itens.length > 0;
  const isNewStructure = hasItens;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="800px">
      <StyledModalHeader className="pedido-detail-modal__header">
        <StyledModalTitle className="pedido-detail-modal__title">
          Detalhes do Pedido
        </StyledModalTitle>
        <StyledCloseButton
          className="pedido-detail-modal__close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </StyledCloseButton>
      </StyledModalHeader>

      <StyledModalBody className="pedido-detail-modal__body">
        {/* Basic Information */}
        <StyledSection className="pedido-detail-modal__section">
          <StyledSectionTitle className="pedido-detail-modal__section-title">
            Informações Básicas
          </StyledSectionTitle>
          <StyledDetailGrid className="pedido-detail-modal__grid">
            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                ID
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.ID || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                Cliente
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.Cliente || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                Status
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                <StatusBadge status={pedido.Status || '-'} />
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                Data
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {formatDate(pedido.Data)}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                Valor Total
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {formatCurrency(pedido.Valor)}
              </StyledDetailValue>
            </StyledDetailItem>

            {pedido.custo && (
              <StyledDetailItem className="pedido-detail-modal__detail-item">
                <StyledDetailLabel className="pedido-detail-modal__detail-label">
                  Custo
                </StyledDetailLabel>
                <StyledDetailValue className="pedido-detail-modal__detail-value">
                  {formatCurrency(pedido.custo)}
                </StyledDetailValue>
              </StyledDetailItem>
            )}
          </StyledDetailGrid>
        </StyledSection>

        {/* Itens (New Structure) */}
        {isNewStructure && (
          <StyledSection className="pedido-detail-modal__section">
            <StyledSectionTitle className="pedido-detail-modal__section-title">
              Itens do Pedido ({pedido.totalItens || pedido.itens.length})
            </StyledSectionTitle>
            <StyledItensList className="pedido-detail-modal__itens-list">
              {pedido.itens.map((item, index) => (
                <StyledItemCard key={index} className="pedido-detail-modal__item-card">
                  <StyledItemHeader className="pedido-detail-modal__item-header">
                    <StyledItemName className="pedido-detail-modal__item-name">
                      {item.nome || '-'}
                    </StyledItemName>
                    <StyledItemValue className="pedido-detail-modal__item-value">
                      {formatCurrency(item.valor)}
                    </StyledItemValue>
                  </StyledItemHeader>
                  <StyledItemDetails className="pedido-detail-modal__item-details">
                    <StyledItemBadge className="pedido-detail-modal__item-badge">
                      Quantidade: {item.quantidade || '-'}
                    </StyledItemBadge>
                    {item.categoria && (
                      <StyledItemBadge className="pedido-detail-modal__item-badge">
                        Categoria: {item.categoria}
                      </StyledItemBadge>
                    )}
                    {item.tipo && (
                      <StyledItemBadge className="pedido-detail-modal__item-badge">
                        Tipo: {item.tipo}
                      </StyledItemBadge>
                    )}
                    {item.origem && (
                      <StyledItemBadge className="pedido-detail-modal__item-badge">
                        Origem: {item.origem === 'Estoque' ? '📦 Estoque' : '🔧 Produção'}
                      </StyledItemBadge>
                    )}
                    {item.status && (
                      <StyledItemBadge className="pedido-detail-modal__item-badge">
                        Status: {item.status}
                      </StyledItemBadge>
                    )}
                  </StyledItemDetails>
                </StyledItemCard>
              ))}
            </StyledItensList>
          </StyledSection>
        )}

        {/* Description (Old Structure or Fallback) */}
        {!isNewStructure && (
          <StyledSection className="pedido-detail-modal__section">
            <StyledSectionTitle className="pedido-detail-modal__section-title">
              Descrição
            </StyledSectionTitle>
            <StyledDetailValue className="pedido-detail-modal__detail-value">
              {pedido.Descrição || pedido.descricao || '-'}
            </StyledDetailValue>
          </StyledSection>
        )}

        {/* Delivery Information */}
        <StyledSection className="pedido-detail-modal__section">
          <StyledSectionTitle className="pedido-detail-modal__section-title">
            Entrega
          </StyledSectionTitle>
          <StyledDetailGrid className="pedido-detail-modal__grid">
            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                Tipo de Entrega
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.tipoEntrega || pedido.Retira || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            {pedido.metodoEntrega && (
              <StyledDetailItem className="pedido-detail-modal__detail-item">
                <StyledDetailLabel className="pedido-detail-modal__detail-label">
                  Método de Entrega
                </StyledDetailLabel>
                <StyledDetailValue className="pedido-detail-modal__detail-value">
                  {pedido.metodoEntrega}
                </StyledDetailValue>
              </StyledDetailItem>
            )}

            {pedido.enderecoEntrega && (
              <StyledDetailItem className="pedido-detail-modal__detail-item">
                <StyledDetailLabel className="pedido-detail-modal__detail-label">
                  Endereço
                </StyledDetailLabel>
                <StyledDetailValue className="pedido-detail-modal__detail-value">
                  {pedido.enderecoEntrega}
                </StyledDetailValue>
              </StyledDetailItem>
            )}

            {pedido.taxaEntrega !== undefined && pedido.taxaEntrega !== null && (
              <StyledDetailItem className="pedido-detail-modal__detail-item">
                <StyledDetailLabel className="pedido-detail-modal__detail-label">
                  Taxa de Entrega
                </StyledDetailLabel>
                <StyledDetailValue className="pedido-detail-modal__detail-value">
                  {formatCurrency(pedido.taxaEntrega)}
                </StyledDetailValue>
              </StyledDetailItem>
            )}
          </StyledDetailGrid>
        </StyledSection>

        {/* Payment and Channel */}
        <StyledSection className="pedido-detail-modal__section">
          <StyledSectionTitle className="pedido-detail-modal__section-title">
            Pagamento e Canal
          </StyledSectionTitle>
          <StyledDetailGrid className="pedido-detail-modal__grid">
            {pedido.metodoPagamento && (
              <StyledDetailItem className="pedido-detail-modal__detail-item">
                <StyledDetailLabel className="pedido-detail-modal__detail-label">
                  Método de Pagamento
                </StyledDetailLabel>
                <StyledDetailValue className="pedido-detail-modal__detail-value">
                  {pedido.metodoPagamento}
                </StyledDetailValue>
              </StyledDetailItem>
            )}

            {pedido.canalOrigem && (
              <StyledDetailItem className="pedido-detail-modal__detail-item">
                <StyledDetailLabel className="pedido-detail-modal__detail-label">
                  Canal de Origem
                </StyledDetailLabel>
                <StyledDetailValue className="pedido-detail-modal__detail-value">
                  {pedido.canalOrigem}
                </StyledDetailValue>
              </StyledDetailItem>
            )}
          </StyledDetailGrid>
        </StyledSection>

        {/* Time Information */}
        {(pedido.tempoEstimadoMinutos !== undefined || pedido.tempoPreparoMinutos !== undefined) && (
          <StyledSection className="pedido-detail-modal__section">
            <StyledSectionTitle className="pedido-detail-modal__section-title">
              Tempo
            </StyledSectionTitle>
            <StyledDetailGrid className="pedido-detail-modal__grid">
              {pedido.tempoEstimadoMinutos !== undefined && (
                <StyledDetailItem className="pedido-detail-modal__detail-item">
                  <StyledDetailLabel className="pedido-detail-modal__detail-label">
                    Tempo Estimado
                  </StyledDetailLabel>
                  <StyledDetailValue className="pedido-detail-modal__detail-value">
                    {pedido.tempoEstimadoMinutos} minutos
                  </StyledDetailValue>
                </StyledDetailItem>
              )}

              {pedido.tempoPreparoMinutos !== undefined && (
                <StyledDetailItem className="pedido-detail-modal__detail-item">
                  <StyledDetailLabel className="pedido-detail-modal__detail-label">
                    Tempo de Preparo
                  </StyledDetailLabel>
                  <StyledDetailValue className="pedido-detail-modal__detail-value">
                    {pedido.tempoPreparoMinutos} minutos
                  </StyledDetailValue>
                </StyledDetailItem>
              )}
            </StyledDetailGrid>
          </StyledSection>
        )}

        {/* Observations */}
        {pedido.Observações && (
          <StyledSection className="pedido-detail-modal__section">
            <StyledSectionTitle className="pedido-detail-modal__section-title">
              Observações
            </StyledSectionTitle>
            <StyledDetailValue className="pedido-detail-modal__detail-value">
              {pedido.Observações}
            </StyledDetailValue>
          </StyledSection>
        )}
      </StyledModalBody>
    </Modal>
  );
};








