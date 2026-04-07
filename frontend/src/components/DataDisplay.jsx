import React, { useState, useMemo, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { TableList } from './TableList';
import {
  SearchableLayout,
  SEARCH_LAYOUT_DEFAULT_FILTER_FIELDS,
  SEARCH_LAYOUT_FILTER_FIELD_ALL,
} from './SearchableLayout';
import { Tabs } from './Tabs';
import { useDashboardTabs } from '../hooks/useDashboardTabs';
import { PedidoDetailModal } from './PedidoDetailModal';
import { AgendamentoDetailModal } from './AgendamentoDetailModal';
import { AtendimentoDetailModal } from './AtendimentoDetailModal';
import styled from 'styled-components';

/**
 * Data Display Container - BEM: data-display
 */
const StyledDataDisplayContainer = styled.div`
  width: 100%;
`;

/**
 * Mobile Card Container - BEM: data-display__cards
 */
const StyledMobileCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Mobile Card - BEM: data-display__card
 */
const StyledMobileCard = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border.primary};
  box-shadow: ${props => props.theme.shadows.sm};
  cursor: pointer;
  transition: box-shadow ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

/**
 * Card Header - BEM: data-display__card-header
 */
const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Card Date - BEM: data-display__card-date
 */
const StyledCardDate = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Card Title Row - BEM: data-display__card-title-row
 */
const StyledCardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

/**
 * Card Title - BEM: data-display__card-title
 */
const StyledCardTitle = styled.div`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Card Description - BEM: data-display__card-description
 */
const StyledCardDescription = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

/**
 * Card Description Content - truncates to 2 lines with ellipsis
 * $expanded: when true shows full text (unused; full details shown in modal)
 */
const StyledCardDescriptionContent = styled.span`
  display: ${props => props.$expanded ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${props => props.$expanded ? 'unset' : '2'};
  -webkit-box-orient: vertical;
  overflow: ${props => props.$expanded ? 'visible' : 'hidden'};
  text-overflow: ${props => props.$expanded ? 'clip' : 'ellipsis'};
  line-height: 1.4;
  word-break: break-word;
  width: 100%;
`;

/**
 * Card Footer - BEM: data-display__card-footer
 */
const StyledCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Card ID - BEM: data-display__card-id
 */
const StyledCardId = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
`;

/**
 * Card Arrow - BEM: data-display__card-arrow
 */
const StyledCardArrow = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Empty State - BEM: data-display__empty
 */
const StyledEmptyState = styled.div`
  padding: ${props => props.theme.spacing['4xl']};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
`;

/**
 * Data Display Component - Responsive (cards on mobile, table on desktop)
 */
export const DataDisplay = ({ data, type }) => {
  const { tabs, currentTab, handleTabClick } = useDashboardTabs();
  const [filter, setFilter] = useState('');
  /** null = search all columns; otherwise row[key] only */
  const [searchScopeField, setSearchScopeField] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setSearchScopeField(null);
  }, [type]);

  const searchPlaceholder = useMemo(() => {
    if (!searchScopeField) return 'Pesquisar';
    const entry = SEARCH_LAYOUT_DEFAULT_FILTER_FIELDS.find(f => f.id === searchScopeField);
    return entry ? `Pesquisar em ${entry.label}` : 'Pesquisar';
  }, [searchScopeField]);

  const adaptedData = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    const filtered = data.filter(row => {
      if (!needle) return true;
      if (!searchScopeField) {
        return Object.values(row).some(val =>
          String(val).toLowerCase().includes(needle)
        );
      }
      const cell = row[searchScopeField];
      return String(cell ?? '').toLowerCase().includes(needle);
    });
    if (type === 'agendamentos' || type === 'atendimentos') {
      return [...filtered].sort((a, b) => {
        const parseDate = (d) => {
          if (!d) return 0;
          const [day, month, year] = String(d).split('/');
          return year && month && day ? new Date(year, month - 1, day).getTime() : 0;
        };
        const parseTime = (t) => {
          if (!t) return 0;
          const parts = String(t).split(':');
          return (parseInt(parts[0], 10) || 0) * 3600 + (parseInt(parts[1], 10) || 0) * 60 + (parseInt(parts[2], 10) || 0);
        };
        const dateDiff = parseDate(a.Data) - parseDate(b.Data);
        return dateDiff !== 0 ? dateDiff : parseTime(a.Hora) - parseTime(b.Hora);
      });
    }
    return filtered;
  }, [data, filter, type, searchScopeField]);

  const arrowIcon = `<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 6.25H14.75M14.75 6.25L9.5 11.75M14.75 6.25L9.5 0.75" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const handleCardClick = (row, idx) => {
    if (type === 'pedidos') {
      setSelectedPedido(row);
      setIsModalOpen(true);
    } else if (type === 'agendamentos') {
      setSelectedAgendamento(row);
      setIsModalOpen(true);
    } else if (type === 'atendimentos') {
      setSelectedAtendimento(row);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setSelectedAgendamento(null);
    setSelectedAtendimento(null);
  };

  const handleFilterFieldSelect = fieldId => {
    setSearchScopeField(fieldId === SEARCH_LAYOUT_FILTER_FIELD_ALL ? null : fieldId);
  };

  return (
    <StyledDataDisplayContainer className="data-display">
      <SearchableLayout
        placeholder={searchPlaceholder}
        onSearchChange={setFilter}
        initialSearchValue={filter}
        onFilterFieldSelect={handleFilterFieldSelect}
        tabs={
          <Tabs
            tabs={tabs}
            activeTab={currentTab}
            onTabClick={handleTabClick}
          />
        }
      >
        {/* Desktop: Table View */}
        {isDesktop ? (
          <TableList data={adaptedData} type={type} enableModalOnRowClick={false} />
        ) : (
          /* Mobile: Card View */
          <StyledMobileCardsContainer className="data-display__cards">
            {adaptedData.length === 0 ? (
              <StyledEmptyState className="data-display__empty">
                Nenhum registro encontrado
              </StyledEmptyState>
            ) : (
              adaptedData.map((row, idx) => {
                const rowId = row.ID || idx;
                const descriptionText = type === 'agendamentos'
                  ? (row.Assunto || row['Descrição Completa'] || '-')
                  : (row.Assunto || row['Descricao Completa'] || '-');

                return (
                <StyledMobileCard 
                  key={rowId} 
                  className="data-display__card"
                  onClick={() => handleCardClick(row, idx)}
                  title={(type === 'agendamentos' || type === 'atendimentos') ? 'Clique para ver detalhes' : undefined}
                >
                  <StyledCardHeader className="data-display__card-header">
                    <StyledCardDate className="data-display__card-date">
                      {`${row.Data || '-'} ${row.Hora ? row.Hora : ''}`.trim()}
                    </StyledCardDate>
                    <StatusBadge status={row.Status || '-'} />
                  </StyledCardHeader>
                  
                  <StyledCardTitleRow className="data-display__card-title-row">
                    <StyledCardTitle className="data-display__card-title">
                      {row.Nome || '-'}
                    </StyledCardTitle>
                  </StyledCardTitleRow>

                  <StyledCardDescription className="data-display__card-description">
                    <StyledCardDescriptionContent $expanded={false}>
                      {descriptionText}
                    </StyledCardDescriptionContent>
                  </StyledCardDescription>

                  <StyledCardFooter className="data-display__card-footer">
                    <StyledCardId className="data-display__card-id">
                      {row.WhatsApp || row.ID || '-'}
                    </StyledCardId>
                    <StyledCardArrow 
                      className="data-display__card-arrow"
                      dangerouslySetInnerHTML={{ __html: arrowIcon }} 
                    />
                  </StyledCardFooter>
                </StyledMobileCard>
                );
              })
            )}
          </StyledMobileCardsContainer>
        )}
        
        {type === 'pedidos' && (
          <PedidoDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            pedido={selectedPedido}
          />
        )}
        {type === 'agendamentos' && (
          <AgendamentoDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            agendamento={selectedAgendamento}
          />
        )}
        {type === 'atendimentos' && (
          <AtendimentoDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            atendimento={selectedAtendimento}
          />
        )}
      </SearchableLayout>
    </StyledDataDisplayContainer>
  );
};



















