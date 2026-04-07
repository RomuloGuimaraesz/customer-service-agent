import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';

/**
 * Modal Header - BEM: agendamento-detail-modal__header
 */
const StyledModalHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Modal Title - BEM: agendamento-detail-modal__title
 */
const StyledModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

/**
 * Close Button - BEM: agendamento-detail-modal__close-button
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
 * Modal Body - BEM: agendamento-detail-modal__body
 */
const StyledModalBody = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

/**
 * Detail Section - BEM: agendamento-detail-modal__section
 */
const StyledSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Section Title - BEM: agendamento-detail-modal__section-title
 */
const StyledSectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

/**
 * Detail Grid - BEM: agendamento-detail-modal__grid
 */
const StyledDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Detail Item - BEM: agendamento-detail-modal__detail-item
 */
const StyledDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

/**
 * Detail Label - BEM: agendamento-detail-modal__detail-label
 */
const StyledDetailLabel = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Detail Value - BEM: agendamento-detail-modal__detail-value
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
 * Agendamento Detail Modal Component
 * Displays complete agendamento information in a modal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal should close
 * @param {Object} props.agendamento - Agendamento object to display
 */
export const AgendamentoDetailModal = ({ isOpen, onClose, agendamento }) => {
  if (!agendamento) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="800px">
      <StyledModalHeader className="agendamento-detail-modal__header">
        <StyledModalTitle className="agendamento-detail-modal__title">
          Detalhes do Agendamento
        </StyledModalTitle>
        <StyledCloseButton
          className="agendamento-detail-modal__close-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </StyledCloseButton>
      </StyledModalHeader>

      <StyledModalBody className="agendamento-detail-modal__body">
        {/* Basic Information - structure from Avecta AI - Agendamentos.csv */}
        <StyledSection className="agendamento-detail-modal__section">
          <StyledSectionTitle className="agendamento-detail-modal__section-title">
            Informações Básicas
          </StyledSectionTitle>
          <StyledDetailGrid className="agendamento-detail-modal__grid">
            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                ID
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                {agendamento.ID || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                Nome
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                {agendamento.Nome || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                Status
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                <StatusBadge status={agendamento.Status || '-'} />
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                Dia da Semana
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                {agendamento['Dia da Semana'] || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                Data
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                {formatDate(agendamento.Data)}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                Hora
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                {agendamento.Hora || '-'}
              </StyledDetailValue>
            </StyledDetailItem>

            <StyledDetailItem className="agendamento-detail-modal__detail-item">
              <StyledDetailLabel className="agendamento-detail-modal__detail-label">
                WhatsApp
              </StyledDetailLabel>
              <StyledDetailValue className="agendamento-detail-modal__detail-value">
                {agendamento.WhatsApp || '-'}
              </StyledDetailValue>
            </StyledDetailItem>
          </StyledDetailGrid>
        </StyledSection>

        {/* Assunto */}
        <StyledSection className="agendamento-detail-modal__section">
          <StyledSectionTitle className="agendamento-detail-modal__section-title">
            Assunto
          </StyledSectionTitle>
          <StyledDetailValue className="agendamento-detail-modal__detail-value">
            {agendamento.Assunto || '-'}
          </StyledDetailValue>
        </StyledSection>
      </StyledModalBody>
    </Modal>
  );
};
