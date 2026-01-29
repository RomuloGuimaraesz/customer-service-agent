import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Dropdown Container - BEM: dropdown
 */
const StyledDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

/**
 * Dropdown Menu - BEM: dropdown__menu
 */
const StyledDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + ${props => props.theme.spacing.xs});
  ${props => props.align === 'left' ? 'left: 0;' : 'right: 0;'}
  min-width: ${props => props.minWidth || '180px'};
  background-color: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndex.dropdown};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: opacity ${props => props.theme.transitions.fast} ease,
              visibility ${props => props.theme.transitions.fast} ease,
              transform ${props => props.theme.transitions.fast} ease;
  padding: ${props => props.theme.spacing.xs};
`;

/**
 * Dropdown Header - BEM: dropdown__header
 * Shows header content in dropdown menu
 */
const StyledDropdownHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

/**
 * Dropdown Menu Item - BEM: dropdown__item
 */
const StyledDropdownItem = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: background-color ${props => props.theme.transitions.fast} ease;

  ${props => props.clickable && `
    &:hover {
      background-color: ${props.theme.colors.background.tertiary};
    }
  `}
`;

/**
 * Dropdown Component
 * A reusable dropdown menu component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Trigger element (clickable)
 * @param {React.ReactNode} props.content - Content to display in dropdown
 * @param {React.ReactNode} [props.header] - Optional header content shown in dropdown
 * @param {string} [props.align='right'] - Alignment: 'left' or 'right'
 * @param {string} [props.minWidth] - Minimum width of dropdown
 * @param {string} [props.className] - Additional CSS class
 */
export const Dropdown = ({ 
  children, 
  content, 
  header,
  align = 'right',
  minWidth,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledDropdownContainer 
      className={className}
      ref={containerRef}
      onClick={handleToggle}
    >
      {children}
      {content && (
        <StyledDropdownMenu 
          className="dropdown__menu"
          isOpen={isOpen}
          align={align}
          minWidth={minWidth}
          ref={dropdownRef}
          onClick={handleContentClick}
        >
          {header && (
            <StyledDropdownHeader className="dropdown__header">
              {header}
            </StyledDropdownHeader>
          )}
          <StyledDropdownItem 
            className="dropdown__item"
            clickable={false}
          >
            {content}
          </StyledDropdownItem>
        </StyledDropdownMenu>
      )}
    </StyledDropdownContainer>
  );
};

