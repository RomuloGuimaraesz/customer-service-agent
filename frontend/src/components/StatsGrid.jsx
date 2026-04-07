import React from 'react';
import styled from 'styled-components';
import { StatsCard } from './StatsCard';

/**
 * Stats section - BEM: stats-grid
 */
const StyledStatsSection = styled.section`
  box-sizing: border-box;
  margin: ${props => props.theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
  justify-content: ${props => (props.$hasTitle ? 'flex-start' : 'center')};
  ${props =>
    props.$hasTitle ? `min-height: 128px;` : `height: 128px;`}
`;

/**
 * Section title h2 — shared by stats grid and main surfaces (Dashboard, Contatos).
 * BEM: stats-grid__heading | dashboard__main-heading | contatos__heading (via className)
 */
export const SurfaceSectionHeading = styled.h2`
  flex-shrink: 0;
  margin: 0 0 ${props => props.theme.spacing['3xl']} ${props => props.theme.spacing['5xl']};
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.2;
`;

/**
 * Stats cards row - BEM: stats-grid__row
 */
const StyledStatsRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 0 ${props => props.theme.spacing['3xl']};
  overflow-x: auto;
`;

/**
 * StatsGrid Component
 * Displays a grid of stat cards with icons, labels, and values
 * Flexible for use in different contexts (dashboard, reports, etc.)
 *
 * @param {Object} props
 * @param {Array<{iconSvg: string, label: string, value: number|string}>} props.stats - Array of stat objects
 * @param {string} [props.sectionTitle] - Optional section heading (e.g. dashboard)
 */
export const StatsGrid = ({ stats, sectionTitle }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <StyledStatsSection className="stats-grid" $hasTitle={Boolean(sectionTitle)}>
      {sectionTitle ? (
        <SurfaceSectionHeading className="stats-grid__heading">
          {sectionTitle}
        </SurfaceSectionHeading>
      ) : null}
      <StyledStatsRow className="stats-grid__row">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            iconSvg={stat.iconSvg}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </StyledStatsRow>
    </StyledStatsSection>
  );
};
