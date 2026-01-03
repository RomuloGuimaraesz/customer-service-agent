import React from 'react';
import styled from 'styled-components';
import { StatsCard } from './StatsCard';

/**
 * Stats Grid Container - BEM: stats-grid
 */
const StyledStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing['2xl']};

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
`;

/**
 * StatsGrid Component
 * Displays a grid of stat cards with icons, labels, and values
 * Flexible for use in different contexts (dashboard, reports, etc.)
 * 
 * @param {Object} props
 * @param {Array<{iconSvg: string, label: string, value: number|string}>} props.stats - Array of stat objects
 */
export const StatsGrid = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <StyledStatsGrid className="stats-grid">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          iconSvg={stat.iconSvg}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </StyledStatsGrid>
  );
};

