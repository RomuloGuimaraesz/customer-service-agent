import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';
import { RoundIconFrame } from './RoundIconButton';
import chevronDownSvg from '../../assets/img/chevron-down.svg?raw';

const FILTER_CHEVRON_SVG = chevronDownSvg.replace(
  /stroke="#443D4F"/g,
  'stroke="currentColor"',
);

/** Sentinel id: search applies to every column (global) */
export const SEARCH_LAYOUT_FILTER_FIELD_ALL = '__all__';

/** Default filter dimensions shown in searchable-layout filter dropdown (ids match row keys where applicable) */
export const SEARCH_LAYOUT_DEFAULT_FILTER_FIELDS = [
  { id: SEARCH_LAYOUT_FILTER_FIELD_ALL, label: 'Todas as colunas' },
  { id: 'Status', label: 'Status' },
  { id: 'Dia da Semana', label: 'Dia da Semana' },
  { id: 'Data', label: 'Data' },
  { id: 'Nome', label: 'Nome' },
  { id: 'WhatsApp', label: 'WhatsApp' },
];

/**
 * Searchable Layout Container - BEM: searchable-layout
 */
const StyledSearchableLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0 ${props => props.theme.spacing['3xl']};
`;

/** Tab bar region - BEM: searchable-layout__tabs */
const StyledTabsRegion = styled.div`
  flex-shrink: 0;
  width: 100%;
  ${props => props.$visualOrderSearchFirst && `order: 2;`}
`;

/** Search Container - BEM: searchable-layout__search-container */
const StyledSearchContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-shrink: 0;
  ${props => props.$visualOrderSearchFirst && `order: 1;`}
`;

/** Search row: filter pill + field — BEM: searchable-layout__search-row */
const StyledSearchRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  flex-wrap: wrap;
`;

/**
 * Filter dropdown trigger — same padding/flex pattern as header__user-info-trigger (padding-left md only, no gap; label + chevron abutted)
 */
const StyledSearchFilterTrigger = styled.button`
  box-sizing: border-box;
  height: 40px;
  padding: 0;
  padding-left: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  width: fit-content;
  border: none;
  border-radius: ${props => props.theme.borderRadius['5xl']};
  background-color: ${props => props.theme.colors.background.white};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast} ease;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

/** BEM: searchable-layout__filter-label — sits like header profile glyph (no gap before chevron chip) */
const StyledSearchFilterLabel = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
`;

/** 32×32 round chip + chevron SVG — same pattern as header__profile-dropdown (inside header__user-info-trigger) */
const StyledSearchFilterChevron = styled(RoundIconFrame)`
  flex-shrink: 0;

  svg {
    width: 8px;
    height: 5px;
    max-width: none;
  }

  svg path {
    stroke-width: 1.25px;
  }
`;

const StyledFilterMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

/** BEM: searchable-layout__filter-option */
const StyledFilterOption = styled.button`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.md};
  border: none;
  border-radius: ${p => p.theme.borderRadius.sm};
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: ${p => p.theme.fontSize.base};
  font-weight: ${p => p.theme.fontWeight.normal};
  color: ${p => p.theme.colors.text.primary};
  font-family: inherit;
  transition: background-color ${p => p.theme.transitions.fast} ease;

  &:hover {
    background-color: ${p => p.theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: -2px;
  }
`;

/**
 * Search Wrapper - BEM: searchable-layout__search-wrapper
 */
const StyledSearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
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
  box-sizing: border-box;
  width: 544px;
  max-width: 100%;
  height: 40px;
  padding: 0 ${props => props.theme.spacing.lg} 0 40px;
  font-size: ${props => props.theme.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.white};
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  transition: border-color ${props => props.theme.transitions.normal};

  &:focus {
    border-color: ${props => props.theme.colors.text.tertiary};
  }
`;

/**
 * Content Container - BEM: searchable-layout__content
 * Default: single column (dashboard). Optional two equal columns (~50% each, gap subtracted) + 16px gap; right white.
 */
const StyledContentContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  ${props => props.$visualOrderSearchFirst && `order: 3;`}

  ${props =>
    props.$twoColumn
      ? `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: 1fr;
    gap: ${props.theme.spacing.lg};
    align-content: stretch;
    min-height: 0;

    & > *:only-child {
      grid-column: 1 / -1;
      min-width: 0;
    }

    & > *:nth-child(2n) {
      background-color: ${props.theme.colors.background.white};
      min-width: 0;
      min-height: 0;
    }
  `
      : `
    display: flex;
    flex-direction: column;
  `}
`;

/**
 * Left column — BEM: searchable-layout__column--primary
 * Inner grid: 3×6, 16px column gap, 70px rows, 8px row gap.
 */
const StyledContentColumnPrimary = styled.div`
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(6, 70px);
  column-gap: ${p => p.theme.spacing.lg};
  row-gap: ${p => p.theme.spacing.sm};
  align-content: start;
`;

const StyledContentColumnSecondary = styled.div`
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background-color: ${p => p.theme.colors.background.white};
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
 * @param {React.ReactNode} [props.tabs] - Optional tab bar; in DOM it appears before the search container, but flex order shows search above tabs then content
 * @param {boolean} [props.showFilter] - When true (default), show Filtros dropdown when filterFields is non-empty
 * @param {Array<{ id: string, label: string }>} [props.filterFields] - Filter menu entries (default: SEARCH_LAYOUT_DEFAULT_FILTER_FIELDS)
 * @param {(fieldId: string) => void} [props.onFilterFieldSelect] - Called when user picks a filter field (`SEARCH_LAYOUT_FILTER_FIELD_ALL` = all columns)
 * @param {boolean} [props.twoColumnContent=false] - When true: outer 2 cols (16px gap), white right; left col is 3×6 grid (16px col gap, 70px rows, 8px row gap)
 */
export const SearchableLayout = ({ 
  children, 
  placeholder = "Pesquisar",
  onSearchChange,
  initialSearchValue = '',
  showSearch = true,
  tabs: tabsSlot = null,
  showFilter = true,
  filterFields = SEARCH_LAYOUT_DEFAULT_FILTER_FIELDS,
  onFilterFieldSelect,
  twoColumnContent = false,
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

  const visualOrderSearchFirst = Boolean(tabsSlot && showSearch);

  const contentChildArray = useMemo(
    () =>
      React.Children.toArray(children).filter(
        c => c != null && c !== false && c !== true,
      ),
    [children],
  );

  const filterFieldList = useMemo(
    () => (Array.isArray(filterFields) ? filterFields : []),
    [filterFields],
  );
  const showFilterUi = showFilter && filterFieldList.length > 0;

  const filterMenuContent = close => (
    <StyledFilterMenuList className="searchable-layout__filter-menu">
      {filterFieldList.map(field => (
        <StyledFilterOption
          key={field.id}
          type="button"
          className="searchable-layout__filter-option"
          onClick={() => {
            onFilterFieldSelect?.(field.id);
            close();
          }}
        >
          {field.label}
        </StyledFilterOption>
      ))}
    </StyledFilterMenuList>
  );

  const filterTrigger = (
    <StyledSearchFilterTrigger
      type="button"
      className="searchable-layout__filter-trigger"
    >
      <StyledSearchFilterLabel className="searchable-layout__filter-label">
        Filtros
      </StyledSearchFilterLabel>
      <StyledSearchFilterChevron
        as="span"
        className="searchable-layout__filter-chevron"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: FILTER_CHEVRON_SVG }}
      />
    </StyledSearchFilterTrigger>
  );

  const renderContent = () => {
    if (!twoColumnContent) {
      return children;
    }
    if (contentChildArray.length === 0) {
      return (
        <>
          <StyledContentColumnPrimary className="searchable-layout__column searchable-layout__column--primary" />
          <StyledContentColumnSecondary className="searchable-layout__column searchable-layout__column--secondary" />
        </>
      );
    }
    if (contentChildArray.length === 1) {
      return children;
    }
    const [leftSlot, ...rightSlots] = contentChildArray;
    return (
      <>
        <StyledContentColumnPrimary className="searchable-layout__column searchable-layout__column--primary">
          {leftSlot}
        </StyledContentColumnPrimary>
        <StyledContentColumnSecondary className="searchable-layout__column searchable-layout__column--secondary">
          {rightSlots.length === 1 ? rightSlots[0] : rightSlots}
        </StyledContentColumnSecondary>
      </>
    );
  };

  return (
    <StyledSearchableLayout className="searchable-layout">
      {tabsSlot && (
        <StyledTabsRegion
          className="searchable-layout__tabs"
          $visualOrderSearchFirst={visualOrderSearchFirst}
        >
          {tabsSlot}
        </StyledTabsRegion>
      )}
      {showSearch && (
        <StyledSearchContainer
          className="searchable-layout__search-container"
          $visualOrderSearchFirst={visualOrderSearchFirst}
        >
          <StyledSearchRow className="searchable-layout__search-row">
            {showFilterUi ? (
              <Dropdown
                className="searchable-layout__filter-dropdown"
                align="left"
                minWidth="200px"
                content={filterMenuContent}
              >
                {filterTrigger}
              </Dropdown>
            ) : null}
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
          </StyledSearchRow>
        </StyledSearchContainer>
      )}
      
      <StyledContentContainer
        className="searchable-layout__content"
        $visualOrderSearchFirst={visualOrderSearchFirst}
        $twoColumn={twoColumnContent}
      >
        {renderContent()}
      </StyledContentContainer>
    </StyledSearchableLayout>
  );
};

