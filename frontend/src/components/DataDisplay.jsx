import React, { useState, useMemo, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { TableList } from './TableList';
import { SearchableLayout } from './SearchableLayout';
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
  const [filter, setFilter] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const arrowIcon = `<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 6.25H14.75M14.75 6.25L9.5 11.75M14.75 6.25L9.5 0.75" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  return (
    <StyledDataDisplayContainer className="data-display">
      <SearchableLayout
        placeholder="Pesquisar"
        onSearchChange={setFilter}
        initialSearchValue={filter}
      >
        {/* Desktop: Table View */}
        {isDesktop ? (
          <TableList data={filteredData} type={type} />
        ) : (
          /* Mobile: Card View */
          <StyledMobileCardsContainer className="data-display__cards">
            {filteredData.length === 0 ? (
              <StyledEmptyState className="data-display__empty">
                Nenhum registro encontrado
              </StyledEmptyState>
            ) : (
              filteredData.map((row, idx) => (
                <StyledMobileCard key={row.ID || idx} className="data-display__card">
                  <StyledCardHeader className="data-display__card-header">
                    <StatusBadge status={row.Status || '-'} />
                    <StyledCardDate className="data-display__card-date">
                      {row.Data || '-'}
                    </StyledCardDate>
                  </StyledCardHeader>
                  
                  <StyledCardTitleRow className="data-display__card-title-row">
                    <StyledCardTitle className="data-display__card-title">
                      {row.Cliente || '-'}
                    </StyledCardTitle>
                    {row.Valor && (
                      <StyledCardTitle className="data-display__card-title">
                        {row.Valor}
                      </StyledCardTitle>
                    )}
                  </StyledCardTitleRow>

                  <StyledCardDescription className="data-display__card-description">
                    {row.Descrição || '-'}
                  </StyledCardDescription>

                  <StyledCardFooter className="data-display__card-footer">
                    <StyledCardId className="data-display__card-id">
                      {row.ID || '-'}
                    </StyledCardId>
                    <StyledCardArrow 
                      className="data-display__card-arrow"
                      dangerouslySetInnerHTML={{ __html: arrowIcon }} 
                    />
                  </StyledCardFooter>
                </StyledMobileCard>
              ))
            )}
          </StyledMobileCardsContainer>
        )}
      </SearchableLayout>
    </StyledDataDisplayContainer>
  );
};



















