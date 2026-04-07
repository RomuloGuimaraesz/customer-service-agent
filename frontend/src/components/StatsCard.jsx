import React from 'react';
import styled from 'styled-components';

/**
 * Stats Card Container - BEM: stats-card
 */
const StyledStatsCard = styled.div`
  width: 272px;
  flex-shrink: 0;
  height: 48px;
  padding: 7px ${props => props.theme.spacing.sm};
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  gap: 16px;

  &:first-child {
    margin-left: 0;
  }
`;

/**
 * Stats Card Icon - BEM: stats-card__icon
 */
const StyledStatsCardIcon = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.icon.stroke};
  overflow: visible;

  svg {
    height: ${props => props.theme.colors.icon.statsSvgHeight};
    width: auto;
    max-width: ${props => props.theme.colors.icon.statsSvgMaxWidth};
    display: block;
    flex-shrink: 0;
    overflow: visible;
  }

  svg circle,
  svg path {
    stroke: currentColor;
    stroke-width: ${props => props.theme.colors.icon.strokeWidth};
  }
`;

/**
 * Stats Card Content - BEM: stats-card__content
 */
const StyledStatsCardContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  overflow-wrap: break-word;
`;

/**
 * Stats Card Label - BEM: stats-card__label
 */
const StyledStatsCardLabel = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1;
`;

/**
 * Stats Card Value - BEM: stats-card__value
 */
const StyledStatsCardValue = styled.div`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  line-height: 1;
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






