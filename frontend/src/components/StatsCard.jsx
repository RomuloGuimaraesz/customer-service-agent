import React from 'react';
import styled from 'styled-components';

/**
 * Stats Card Container - BEM: stats-card
 */
const StyledStatsCard = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

/**
 * Stats Card Icon - BEM: stats-card__icon
 */
const StyledStatsCardIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Stats Card Content - BEM: stats-card__content
 */
const StyledStatsCardContent = styled.div`
  flex: 1;
`;

/**
 * Stats Card Label - BEM: stats-card__label
 */
const StyledStatsCardLabel = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

/**
 * Stats Card Value - BEM: stats-card__value
 */
const StyledStatsCardValue = styled.div`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Stats Card Component
 */
export const StatsCard = ({ iconSvg, label, value }) => (
  <StyledStatsCard className="stats-card">
    <StyledStatsCardIcon 
      className="stats-card__icon"
      dangerouslySetInnerHTML={{ __html: iconSvg }} 
    />
    <StyledStatsCardContent className="stats-card__content">
      <StyledStatsCardLabel className="stats-card__label">
        {label}
      </StyledStatsCardLabel>
      <StyledStatsCardValue className="stats-card__value">
        {value}
      </StyledStatsCardValue>
    </StyledStatsCardContent>
  </StyledStatsCard>
);






