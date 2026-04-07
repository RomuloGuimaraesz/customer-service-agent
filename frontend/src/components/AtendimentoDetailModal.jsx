import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';

/**
 * Modal Header - BEM: atendimento-detail-modal__header
 */
const StyledModalHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Modal Title - BEM: atendimento-detail-modal__title
 */
const StyledModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

/**
 * Close Button - BEM: atendimento-detail-modal__close-button
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
 * Modal Body - BEM: atendimento-detail-modal__body
 */
const StyledModalBody = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

/**
 * Detail Section - BEM: atendimento-detail-modal__section
 */
const StyledSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Section Title - BEM: atendimento-detail-modal__section-title
 */
const StyledSectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

/**
 * Detail Grid - BEM: atendimento-detail-modal__grid
 */
const StyledDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Detail Item - BEM: atendimento-detail-modal__detail-item
 */
const StyledDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

/**
 * Detail Label - BEM: atendimento-detail-modal__detail-label
 */
const StyledDetailLabel = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Detail Value - BEM: atendimento-detail-modal__detail-value
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
 * Atendimento Detail Modal Component
 * Displays complete atendimento information in a modal
 * Schema matches Avecta AI - Atendimentos.csv (same as Pedidos)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 * @param {Object} props.atendimento - Atendimento object to display
 */
export const AtendimentoDetailModal = ({ isOpen, onClose, atendimento }) => {
  if (!atendimento) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="800px">
      <StyledModalHeader className="atendimento-detail-modal__header">
        <StyledModalTitle className="atendimento-detail-modal__title">
          Detalhes do Atendimento
        </StyledModalTitle>
        <StyledCloseButton
          className="atendimento-detail-modal__close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </StyledCloseButton>
      </StyledModalHeader>

      <StyledModalBody className="atendimento-detail-modal__body">
        {/* Basic Information - structure from Avecta AI - Atendimentos.csv */}
        <StyledSection className="atendimento-detail-modal__section">
          <StyledSectionTitle className="atendimento-detail-modal__section-title">
            Informações Básicas
          </StyledSectionTitle>
          <StyledDetailGrid className="atendimento-detail-modal__grid">
            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                ID
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                {atendimento.ID || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                Nome
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                {atendimento.Nome || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                Status
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                <StatusBadge status={atendimento.Status || '-'} />
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                Data
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                {formatDate(atendimento.Data)}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                Hora
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                {atendimento.Hora || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                WhatsApp
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                {atendimento.WhatsApp || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="atendimento-detail-modal__detail-item">
              <StyledDetailLabel className="atendimento-detail-modal__detail-label">
                Prioridade
              </StyledDetailLabel>
              <StyledDetailValue className="atendimento-detail-modal__detail-value">
                {atendimento.Prioridade || '-'}
              </StyledDetailValue>
            </StyledDetailItem>
          </StyledDetailGrid>
        </StyledSection>

        {/* Assunto */}
        <StyledSection className="atendimento-detail-modal__section">
          <StyledSectionTitle className="atendimento-detail-modal__section-title">
            Assunto
          </StyledSectionTitle>
          <StyledDetailValue className="atendimento-detail-modal__detail-value">
            {atendimento.Assunto || '-'}
          </StyledDetailValue>
        </StyledSection>

      </StyledModalBody>
    </Modal>
  );
};
