import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Header, Logo } from './Header';
import { Toast } from './Toast';
import { DemandaForm } from './DemandaForm';
import { DEMANDA_STATUS } from '../data/demandasSeed';
import {
  DEMANDAS_MODO_KEY,
  createDemandaId,
  formatTempoDecorrido,
  loadDemandas,
  readJSON,
  saveDemandas,
  writeJSON,
} from '../utils/demandasStorage';

// ============================================================================
// CONFIGURATION - Easy to find and change
// ============================================================================
const CONFIG = {
  pageTitle: 'Demandas',
  modeNavAriaLabel: 'Modo de demandas',
  modeNovaLabel: 'Nova demanda',
  modeListaLabel: 'Demandas',
  listHeading: 'Demandas registradas',
  listEmpty: 'Nenhuma demanda registrada.',
  toastRegistrada: 'Demanda registrada.',
};

const MODE_NOVA = 'nova';
const MODE_LISTA = 'lista';
const MODES = [MODE_NOVA, MODE_LISTA];

const MOBILE_QUERY = '(max-width: 768px)';

// ============================================================================
// STYLED COMPONENTS - Grouped by section
// ============================================================================

// Layout
const StyledDemanda = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${p => p.theme.colors.background.primary};
  color: ${p => p.theme.colors.text.primary};
  font-family: ${p => p.theme.fontFamily.primary};
`;

const StyledMainContent = styled.main`
  box-sizing: border-box;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  flex: 1;
  padding: 0 ${p => p.theme.spacing['5xl']} ${p => p.theme.spacing['5xl']};
  overflow-x: hidden;

  @media ${MOBILE_QUERY} {
    padding: 0 ${p => p.theme.spacing.lg} ${p => p.theme.spacing['3xl']};
  }
`;

/** Row: page title + pill nav — BEM: demanda__heading-row */
const StyledHeadingRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${p => p.theme.spacing.lg};
  margin: 0 0 ${p => p.theme.spacing['2xl']} 0;
`;

const DemandaHeading = styled.h2`
  margin: 0;
  font-size: ${p => p.theme.fontSize['3xl']};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.colors.text.primary};
  line-height: 1.2;
`;

/** Pill nav: same shell as contatos__pill, sized for touch — BEM: demanda__pill */
const DemandaModeNav = styled.nav`
  display: none;

  @media ${MOBILE_QUERY} {
    display: block;
    width: 100%;
  }
`;

const DemandaNavPill = styled.div`
  box-sizing: border-box;
  height: 52px;
  padding: ${p => p.theme.spacing.xs};
  background-color: ${p => p.theme.colors.background.white};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.xs};
`;

const DemandaNavSegment = styled.button`
  box-sizing: border-box;
  flex: 1;
  height: 44px;
  padding: 0 ${p => p.theme.spacing.md};
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-family: inherit;
  font-size: ${p => p.theme.fontSize.base};
  font-weight: ${p => p.theme.fontWeight.medium};
  transition: background-color ${p => p.theme.transitions.fast} ease,
    color ${p => p.theme.transitions.fast} ease;
  color: ${p =>
    p.$active ? p.theme.colors.text.light : p.theme.colors.text.primary};
  background-color: ${p =>
    p.$active ? p.theme.colors.button.primary : p.theme.colors.background.white};

  &:hover:not(:disabled) {
    background-color: ${p =>
      p.$active
        ? p.theme.colors.button.primaryHover
        : p.theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

const DemandaColumns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${p => p.theme.spacing['3xl']};
  align-items: start;

  @media ${MOBILE_QUERY} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/** Both panes stay mounted; on mobile only the active mode is shown. */
const DemandaPane = styled.section`
  min-width: 0;

  @media ${MOBILE_QUERY} {
    display: ${p => (p.$hiddenOnMobile ? 'none' : 'block')};
  }
`;

// List
const DemandaListHeading = styled.h3`
  margin: 0 0 ${p => p.theme.spacing.md} 0;
  font-size: ${p => p.theme.fontSize.lg};
  font-weight: ${p => p.theme.fontWeight.semibold};
  color: ${p => p.theme.colors.text.primary};
`;

const DemandaListUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.sm};
`;

const DemandaListItem = styled.li`
  padding: ${p => p.theme.spacing.md};
  border-radius: ${p => p.theme.borderRadius.lg};
  border: 1px solid ${p => p.theme.colors.border.primary};
  background-color: ${p => p.theme.colors.background.tertiary};
`;

const DemandaListItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${p => p.theme.spacing.sm};
`;

const DemandaListItemTitle = styled.div`
  font-size: ${p => p.theme.fontSize.base};
  font-weight: ${p => p.theme.fontWeight.semibold};
  color: ${p => p.theme.colors.text.primary};
  min-width: 0;
  overflow-wrap: anywhere;
`;

const DemandaListItemDescricao = styled.p`
  margin: ${p => p.theme.spacing.xs} 0 0 0;
  font-size: ${p => p.theme.fontSize.base};
  color: ${p => p.theme.colors.text.primary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DemandaListItemMeta = styled.div`
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.text.secondary};
  margin-top: ${p => p.theme.spacing.xs};
`;

const DemandaListEmpty = styled.p`
  margin: 0;
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.text.secondary};
`;

const STATUS_COLORS = {
  [DEMANDA_STATUS.ABERTA]: { bg: 'infoBg', text: 'infoText' },
  [DEMANDA_STATUS.ENCAMINHADA]: { bg: 'warningBg', text: 'warningText' },
  [DEMANDA_STATUS.RESOLVIDA]: { bg: 'successBg', text: 'successText' },
};

/** Status tag — BEM: demanda__status */
const DemandaStatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 2px ${p => p.theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${p => p.theme.fontSize.xs};
  font-weight: ${p => p.theme.fontWeight.semibold};
  background-color: ${p =>
    p.theme.colors.status[STATUS_COLORS[p.$status]?.bg] ??
    p.theme.colors.background.secondary};
  color: ${p =>
    p.theme.colors.status[STATUS_COLORS[p.$status]?.text] ??
    p.theme.colors.text.secondary};
`;

function readInitialMode() {
  const stored = readJSON(DEMANDAS_MODO_KEY);
  return MODES.includes(stored) ? stored : MODE_NOVA;
}

function getIsMobile() {
  try {
    return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
  } catch {
    return false;
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Demanda Component
 * Protótipo navegável de registro de demandas (rota pública /demanda).
 * Roda só no navegador: dados em localStorage, sem rede e sem auth. BEM: demanda
 */
export const Demanda = () => {
  const [mode, setMode] = useState(readInitialMode);
  const [demandas, setDemandas] = useState(loadDemandas);
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    writeJSON(DEMANDAS_MODO_KEY, mode);
  }, [mode]);

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const t = setTimeout(
      () => setToast(prev => ({ ...prev, visible: false })),
      4000,
    );
    return () => clearTimeout(t);
  }, [toast.visible, toast.message]);

  const demandasOrdenadas = useMemo(
    () =>
      [...demandas].sort(
        (a, b) => new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime(),
      ),
    [demandas],
  );

  const handleRegistrar = useCallback(
    values => {
      const nova = {
        id: createDemandaId(),
        ...values,
        criadaEm: new Date().toISOString(),
        status: DEMANDA_STATUS.ABERTA,
      };
      const next = [nova, ...demandas];
      setDemandas(next);
      saveDemandas(next);
      setToast({ visible: true, message: CONFIG.toastRegistrada });
    },
    [demandas],
  );

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <StyledDemanda className="demanda">
      <Header left={<Logo />} centerLogo />

      <StyledMainContent className="demanda__content">
        <StyledHeadingRow className="demanda__heading-row">
          <DemandaHeading className="demanda__heading">{CONFIG.pageTitle}</DemandaHeading>
          <DemandaModeNav
            className="demanda__pill-nav"
            aria-label={CONFIG.modeNavAriaLabel}
          >
            <DemandaNavPill className="demanda__pill">
              <DemandaNavSegment
                type="button"
                className="demanda__pill-segment demanda__pill-segment--nova"
                $active={mode === MODE_NOVA}
                aria-pressed={mode === MODE_NOVA}
                onClick={() => setMode(MODE_NOVA)}
              >
                {CONFIG.modeNovaLabel}
              </DemandaNavSegment>
              <DemandaNavSegment
                type="button"
                className="demanda__pill-segment demanda__pill-segment--lista"
                $active={mode === MODE_LISTA}
                aria-pressed={mode === MODE_LISTA}
                onClick={() => setMode(MODE_LISTA)}
              >
                {CONFIG.modeListaLabel}
              </DemandaNavSegment>
            </DemandaNavPill>
          </DemandaModeNav>
        </StyledHeadingRow>

        <DemandaColumns className="demanda__columns">
          <DemandaPane
            className="demanda__pane demanda__pane--form"
            aria-label={CONFIG.modeNovaLabel}
            $hiddenOnMobile={mode !== MODE_NOVA}
          >
            <DemandaForm onRegistrar={handleRegistrar} />
          </DemandaPane>

          <DemandaPane
            className="demanda__pane demanda__pane--lista"
            aria-label={CONFIG.listHeading}
            $hiddenOnMobile={mode !== MODE_LISTA}
          >
            <DemandaListHeading>
              {CONFIG.listHeading} ({demandasOrdenadas.length})
            </DemandaListHeading>
            {demandasOrdenadas.length === 0 ? (
              <DemandaListEmpty>{CONFIG.listEmpty}</DemandaListEmpty>
            ) : (
              <DemandaListUl>
                {demandasOrdenadas.map(demanda => {
                  const metaParts = [
                    demanda.bairro,
                    demanda.categoria,
                    formatTempoDecorrido(demanda.criadaEm),
                  ].filter(Boolean);
                  return (
                    <DemandaListItem key={demanda.id} className="demanda__list-item">
                      <DemandaListItemTop>
                        <DemandaListItemTitle>{demanda.nome || '—'}</DemandaListItemTitle>
                        <DemandaStatusTag
                          className="demanda__status"
                          $status={demanda.status}
                        >
                          {demanda.status}
                        </DemandaStatusTag>
                      </DemandaListItemTop>
                      {demanda.descricao ? (
                        <DemandaListItemDescricao>{demanda.descricao}</DemandaListItemDescricao>
                      ) : null}
                      <DemandaListItemMeta>{metaParts.join(' · ')}</DemandaListItemMeta>
                    </DemandaListItem>
                  );
                })}
              </DemandaListUl>
            )}
          </DemandaPane>
        </DemandaColumns>

        <Toast
          message={toast.message}
          visible={toast.visible}
          onClose={handleCloseToast}
          isMobile={isMobile}
          variant="success"
          icon="✓"
        />
      </StyledMainContent>
    </StyledDemanda>
  );
};
