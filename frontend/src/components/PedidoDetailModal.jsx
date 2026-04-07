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
        {/* Basic Information - structure from Avecta AI - Pedidos.csv */}
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
                Nome
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.Nome || '-'}
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
                Hora
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.Hora || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                WhatsApp
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.WhatsApp || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="pedido-detail-modal__detail-item">
              <StyledDetailLabel className="pedido-detail-modal__detail-label">
                Prioridade
              </StyledDetailLabel>
              <StyledDetailValue className="pedido-detail-modal__detail-value">
                {pedido.Prioridade || '-'}
              </StyledDetailValue>
            </StyledDetailItem>
          </StyledDetailGrid>
        </StyledSection>

        {/* Assunto */}
        <StyledSection className="pedido-detail-modal__section">
          <StyledSectionTitle className="pedido-detail-modal__section-title">
            Assunto
          </StyledSectionTitle>
          <StyledDetailValue className="pedido-detail-modal__detail-value">
            {pedido.Assunto || '-'}
          </StyledDetailValue>
        </StyledSection>

      </StyledModalBody>
    </Modal>
  );
};









