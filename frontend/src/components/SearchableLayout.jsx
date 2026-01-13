import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Search Container - BEM: searchable-layout__search-container
 */
const StyledSearchContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

/**
 * Search Wrapper - BEM: searchable-layout__search-wrapper
 */
const StyledSearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
`;

/**
 * Search Icon - BEM: searchable-layout__search-icon
 */
const StyledSearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

/**
 * Search Input - BEM: searchable-layout__search-input
 */
const StyledSearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg} 
           ${props => props.theme.spacing.md} 40px;
  font-size: ${props => props.theme.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  transition: border-color ${props => props.theme.transitions.normal};

  &:focus {
    border-color: ${props => props.theme.colors.text.tertiary};
  }
`;

/**
 * Content Container - BEM: searchable-layout__content
 */
const StyledContentContainer = styled.div`
  width: 100%;
`;

/**
 * Search Icon SVG - Shared constant
 */
const SEARCH_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.875 12.875L8.87507 8.875M10.2083 5.54167C10.2083 8.119 8.119 10.2083 5.54167 10.2083C2.96434 10.2083 0.875 8.119 0.875 5.54167C0.875 2.96434 2.96434 0.875 5.54167 0.875C8.119 0.875 10.2083 2.96434 10.2083 5.54167Z" stroke="#9ca3af" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/**
 * SearchableLayout Component
 * Provides consistent search UI pattern across tab components
 * 
 * Features:
 * - Consistent styling and behavior
 * - Flexible placeholder customization
 * - Optional search visibility
 * - Controlled or uncontrolled search state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display below search
 * @param {string} props.placeholder - Search input placeholder (default: "Pesquisar")
 * @param {Function} props.onSearchChange - Callback when search value changes (receives new value)
 * @param {string} props.initialSearchValue - Initial search value (optional, for controlled component)
 * @param {boolean} props.showSearch - Whether to show search input (default: true)
 */
export const SearchableLayout = ({ 
  children, 
  placeholder = "Pesquisar",
  onSearchChange,
  initialSearchValue = '',
  showSearch = true
}) => {
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  // Sync internal state with initialSearchValue prop changes
  useEffect(() => {
    setSearchValue(initialSearchValue);
  }, [initialSearchValue]);

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // Call the callback if provided
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  return (
    <div className="searchable-layout">
      {showSearch && (
        <StyledSearchContainer className="searchable-layout__search-container">
          <StyledSearchWrapper className="searchable-layout__search-wrapper">
            <StyledSearchIcon 
              className="searchable-layout__search-icon"
              dangerouslySetInnerHTML={{ __html: SEARCH_ICON_SVG }} 
            />
            <StyledSearchInput
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="searchable-layout__search-input"
            />
          </StyledSearchWrapper>
        </StyledSearchContainer>
      )}
      
      <StyledContentContainer className="searchable-layout__content">
        {children}
      </StyledContentContainer>
    </div>
  );
};

