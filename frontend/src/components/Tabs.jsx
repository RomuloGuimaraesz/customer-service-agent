import React from 'react';
import styled from 'styled-components';

/**
 * Tabs Container - BEM: tabs
 */
const StyledTabsContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: ${props => props.theme.spacing.lg};
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  position: relative;
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

/**
 * Tabs Inner - BEM: tabs__inner
 */
const StyledTabsInner = styled.div`
  display: flex;
  gap: 0;
  min-width: max-content;
`;

/**
 * Tab Button - BEM: tabs__button
 */
const StyledTabButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: none;
  border-bottom: 3px solid ${props => props.active 
    ? props.theme.colors.text.primary 
    : 'transparent'};
  background-color: transparent;
  color: ${props => props.active 
    ? props.theme.colors.text.primary 
    : props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
  z-index: ${props => props.active ? 1 : 0};
  box-sizing: border-box;
`;

/**
 * Tab Badge - BEM: tabs__badge
 */
const StyledTabBadge = styled.span`
  padding: 2px ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize.sm};
  border-radius: 10px;
  background-color: ${props => props.active 
    ? props.theme.colors.background.tertiary 
    : props.theme.colors.background.tertiary};
  color: ${props => props.active 
    ? props.theme.colors.text.primary 
    : props.theme.colors.text.secondary};
`;

/**
 * Tabs Component
 * Navigation tabs component that can be easily converted to a left menu
 * 
 * @param {Object} props
 * @param {Array<{id: string, label: string, count?: number}>} props.tabs - Array of tab objects
 * @param {string} props.activeTab - Currently active tab ID
 * @param {Function} props.onTabClick - Callback when a tab is clicked (receives tabId)
 */
export const Tabs = ({ tabs, activeTab, onTabClick }) => {
  return (
    <StyledTabsContainer className="tabs">
      <StyledTabsInner className="tabs__inner">
        {tabs.map(tab => (
          <StyledTabButton
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            active={activeTab === tab.id}
            className="tabs__button"
          >
            {tab.label}
            {tab.count !== null && tab.count !== undefined && (
              <StyledTabBadge 
                active={activeTab === tab.id}
                className="tabs__badge"
              >
                {tab.count}
              </StyledTabBadge>
            )}
          </StyledTabButton>
        ))}
      </StyledTabsInner>
    </StyledTabsContainer>
  );
};

