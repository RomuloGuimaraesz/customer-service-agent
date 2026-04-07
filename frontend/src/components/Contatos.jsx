import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { CONFIG } from '../config/constants';
import { ROUTES } from '../config/routes';
import { supabase } from '../infrastructure/supabase/config';
import { Header, Logo } from './Header';
import { MainNavigation } from './MainNavigation';
import { StatsGrid, SurfaceSectionHeading } from './StatsGrid';
import { AuthenticatedHeaderRight } from './AuthenticatedHeaderRight';
import {
  SearchableLayout,
  SEARCH_LAYOUT_FILTER_FIELD_ALL,
} from './SearchableLayout';
import { Tabs } from './Tabs';
import { useTabAnalytics } from '../hooks/useTabAnalytics';
import { CONTATOS_SURFACE_TABS } from '../config/contatosSurfaceTabs';
import { PROFILE_ICON } from '../config/icons';
import {
  getContatos,
  deleteContato,
  putContatos,
  postNovoContato,
} from '../services/contatosApi';
import {
  buildFlatContatoPayload,
  getContatoRowKey,
  mapContatoRowToDadosPrincipais,
  mapContatoRowToMaisInfoValues,
} from '../utils/contatosRowMapper';
import { Toast } from './Toast';
import { ContatosContactForm } from './ContatosContactForm';
import {
  ContatosMaisInformacoesModal,
  createInitialMaisInfoValues,
} from './ContatosMaisInformacoesModal';

const CONTATOS_TABS = CONTATOS_SURFACE_TABS.map(({ id, name }) => ({
  id,
  label: name,
}));

/** Filtros da busca — ids alinhados a chaves futuras da lista de contatos */
const CONTATOS_FILTER_FIELDS = [
  { id: SEARCH_LAYOUT_FILTER_FIELD_ALL, label: 'Todas as colunas' },
  { id: 'nome', label: 'Nome Completo' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'cidade', label: 'Cidade' },
  { id: 'bairro', label: 'Bairro' },
  { id: 'cep', label: 'CEP' },
];

const TOAST_MAIN_OK = 'Dados principais registrados.';
const TOAST_EXTRA_READY = 'Informações adicionais prontas para envio.';

const StyledContatos = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fontFamily.primary};
`;

const StyledMainContent = styled.main`
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

/** Row: page title + pill nav — BEM: contatos__heading-row */
const StyledContatosHeadingRow = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing['3xl']};
  margin: 0 0 ${p => p.theme.spacing['3xl']} ${p => p.theme.spacing['5xl']};
`;

/** White shell matching main-navigation__pill — BEM: contatos__pill */
const ContatosNavPill = styled.div`
  box-sizing: border-box;
  height: 40px;
  padding: ${p => p.theme.spacing.xs};
  background-color: ${p => p.theme.colors.background.white};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.xs};
  flex-shrink: 0;
`;

/** Text segment: same active/hover logic as RoundIconButton — BEM: contatos__pill-segment */
const ContatosNavSegment = styled.button`
  box-sizing: border-box;
  height: 32px;
  padding: 0 ${p => p.theme.spacing.md};
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-family: inherit;
  font-size: ${p => p.theme.fontSize.sm};
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

const ContatosSectionHeading = styled(SurfaceSectionHeading)`
  margin: 0;
`;

/** Right column shell (detalhes / painel futuro) — BEM: contatos__detail-pane */
const ContatosRightPane = styled.div`
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: ${p => p.theme.spacing.md};
`;

const ContatosListHeading = styled.h3`
  margin: 0 0 ${p => p.theme.spacing.md} 0;
  font-size: ${p => p.theme.fontSize.lg};
  font-weight: ${p => p.theme.fontWeight.semibold};
  color: ${p => p.theme.colors.text.primary};
`;

const ContatosListUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.sm};
`;

const ContatosListItem = styled.li`
  padding: 0;
  border-radius: ${p => p.theme.borderRadius.lg};
  border: 1px solid
    ${p =>
      p.$selected ? p.theme.colors.button.primary : p.theme.colors.border.primary};
  background-color: ${p =>
    p.$selected
      ? p.theme.colors.background.secondary
      : p.theme.colors.background.tertiary};
`;

const ContatosListRowActions = styled.div`
  display: flex;
  align-items: stretch;
`;

const ContatosListRowButton = styled.button`
  display: block;
  width: 100%;
  margin: 0;
  padding: ${p => p.theme.spacing.md};
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
  font-family: inherit;
  text-align: left;
  border-radius: inherit;

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

const ContatosDeleteButton = styled.button`
  width: 44px;
  min-width: 44px;
  border: none;
  border-left: 1px solid ${p => p.theme.colors.border.primary};
  background: transparent;
  color: ${p => p.theme.colors.status.errorText};
  cursor: pointer;
  font-size: ${p => p.theme.fontSize.lg};
  line-height: 1;
  transition: background-color ${p => p.theme.transitions.fast} ease;

  &:hover {
    background-color: ${p => p.theme.colors.status.errorBg};
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: -2px;
  }
`;

const ContatosListItemTitle = styled.div`
  font-size: ${p => p.theme.fontSize.base};
  font-weight: ${p => p.theme.fontWeight.semibold};
  color: ${p => p.theme.colors.text.primary};
`;

const ContatosListItemMeta = styled.div`
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.text.secondary};
  margin-top: ${p => p.theme.spacing.xs};
`;

const ContatosListEmpty = styled.p`
  margin: 0;
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.text.secondary};
`;

const ContatosListError = styled.p`
  margin: 0;
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.status.errorText};
`;

/** Mapeia ids do filtro da busca para chaves retornadas pelo GET (planilha / n8n). */
const CONTATOS_FILTER_SCOPE_TO_ROW_KEY = {
  nome: 'Nome',
  whatsapp: 'WhatsApp',
  cidade: 'Cidade',
  bairro: 'Bairro',
  cep: 'CEP',
};

export const Contatos = () => {
  const [contatosPillMode, setContatosPillMode] = useState('todos');
  const [activeContatosTab, setActiveContatosTab] = useState(
    CONTATOS_TABS[0].id,
  );
  const [contatosSearch, setContatosSearch] = useState('');
  /** null = todas as colunas; senão id de CONTATOS_FILTER_FIELDS */
  const [contatosSearchScope, setContatosSearchScope] = useState(null);
  const [maisInfoOpen, setMaisInfoOpen] = useState(false);
  const [maisInfoValues, setMaisInfoValues] = useState(() =>
    createInitialMaisInfoValues(),
  );
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    variant: 'success',
  });
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768,
  );
  const [contatosLista, setContatosLista] = useState([]);
  const [contatosLoading, setContatosLoading] = useState(true);
  const [contatosLoadError, setContatosLoadError] = useState('');
  /** `null` = nenhuma linha selecionada na lista (form vazio em Todos) */
  const [selectedContatoKey, setSelectedContatoKey] = useState(null);
  const { credentials, isAuthenticated, role, userId, getAuthHeader } = useAuth();
  const contatosTabNames = useMemo(
    () => Object.fromEntries(CONTATOS_TABS.map(t => [t.id, t.label])),
    [],
  );
  useTabAnalytics(activeContatosTab, userId, role, {
    surface: 'contatos',
    tabNames: contatosTabNames,
  });
  const adminContext = useAdmin();
  const { stats } = useDashboardStats(
    adminContext.pedidos,
    adminContext.agendamentos,
    adminContext.atendimentos
  );

  useEffect(() => {
    setContatosSearchScope(null);
  }, [contatosPillMode]);

  useEffect(() => {
    const init = createInitialMaisInfoValues();
    setMaisInfoValues(init);
  }, [contatosPillMode]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const t = setTimeout(
      () => setToast(prev => ({ ...prev, visible: false })),
      5000,
    );
    return () => clearTimeout(t);
  }, [toast.visible, toast.message]);

  const loadContatos = useCallback(async () => {
    setContatosLoading(true);
    setContatosLoadError('');
    try {
      const data = await getContatos(getAuthHeader());
      setContatosLista(Array.isArray(data) ? data : []);
    } catch (error) {
      setContatosLoadError(
        error?.message || 'Não foi possível carregar os contatos.',
      );
      setContatosLista([]);
    } finally {
      setContatosLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    loadContatos();
  }, [loadContatos]);

  const handleMaisInfoChange = useCallback((field, value) => {
    setMaisInfoValues(s => ({ ...s, [field]: value }));
  }, []);

  const handleSaveInformacoesAdicionais = useCallback(async () => {
    setMaisInfoOpen(false);
    setToast({
      visible: true,
      message: TOAST_EXTRA_READY,
      variant: 'success',
    });
  }, []);

  const selectedContatoRow = useMemo(() => {
    if (!selectedContatoKey) return null;
    return (
      contatosLista.find(
        (r, i) => getContatoRowKey(r, i) === selectedContatoKey,
      ) ?? null
    );
  }, [contatosLista, selectedContatoKey]);

  const prefillDadosPrincipais = useMemo(() => {
    if (!selectedContatoRow) return null;
    return mapContatoRowToDadosPrincipais(selectedContatoRow);
  }, [selectedContatoRow]);

  const handleMainFormSave = useCallback(
    async dadosPrincipais => {
      const authHeader = getAuthHeader();
      try {
        if (contatosPillMode === 'novo') {
          const body = buildFlatContatoPayload(dadosPrincipais, maisInfoValues);
          await postNovoContato(body, authHeader);
        } else {
          if (!selectedContatoRow) {
            setToast({
              visible: true,
              message: 'Selecione um contato da lista para atualizar.',
              variant: 'error',
            });
            return;
          }
          const body = buildFlatContatoPayload(dadosPrincipais, maisInfoValues);
          // Backend n8n usa WhatsApp como chave de busca para UPDATE.
          // Mantemos a chave original da linha selecionada para evitar no-op
          // quando o usuário altera o campo WhatsApp no formulário.
          const originalWhatsapp =
            selectedContatoRow.WhatsApp ?? selectedContatoRow['WhatsApp'];
          if (originalWhatsapp != null && String(originalWhatsapp).trim() !== '') {
            body.WhatsApp = String(originalWhatsapp).trim();
          }
          await putContatos(body, authHeader);
        }
        setToast({
          visible: true,
          message: TOAST_MAIN_OK,
          variant: 'success',
        });
        await loadContatos();
      } catch (err) {
        setToast({
          visible: true,
          message: err?.message || 'Não foi possível salvar o contato.',
          variant: 'error',
        });
      }
    },
    [
      contatosPillMode,
      maisInfoValues,
      selectedContatoRow,
      getAuthHeader,
      loadContatos,
    ],
  );

  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const contatosSearchPlaceholder = useMemo(() => {
    if (!contatosSearchScope) return 'Pesquisar contatos';
    const entry = CONTATOS_FILTER_FIELDS.find(f => f.id === contatosSearchScope);
    return entry ? `Pesquisar em ${entry.label}` : 'Pesquisar contatos';
  }, [contatosSearchScope]);

  const handleContatosFilterFieldSelect = fieldId => {
    setContatosSearchScope(
      fieldId === SEARCH_LAYOUT_FILTER_FIELD_ALL ? null : fieldId,
    );
  };

  const contatosFiltrados = useMemo(() => {
    if (!contatosLista.length) return [];
    const needle = contatosSearch.trim().toLowerCase();
    const scopeKey =
      contatosSearchScope &&
      contatosSearchScope !== SEARCH_LAYOUT_FILTER_FIELD_ALL
        ? CONTATOS_FILTER_SCOPE_TO_ROW_KEY[contatosSearchScope]
        : null;

    return contatosLista.filter(row => {
      if (!needle) return true;
      if (scopeKey) {
        return String(row[scopeKey] ?? '')
          .toLowerCase()
          .includes(needle);
      }
      return Object.values(row).some(v =>
        String(v ?? '')
          .toLowerCase()
          .includes(needle),
      );
    });
  }, [contatosLista, contatosSearch, contatosSearchScope]);

  const handleSelectContatoRow = useCallback(row => {
    const fullIdx = contatosLista.indexOf(row);
    const idx = fullIdx >= 0 ? fullIdx : 0;
    setContatosPillMode('todos');
    setSelectedContatoKey(getContatoRowKey(row, idx));
    const mais = mapContatoRowToMaisInfoValues(row);
    setMaisInfoValues(mais);
  }, [contatosLista]);

  const handleDeleteContato = useCallback(
    async row => {
      const authHeader = getAuthHeader();
      const targetRow = row;
      const whatsapp = targetRow?.WhatsApp ?? targetRow?.['WhatsApp'];
      const key = whatsapp != null ? String(whatsapp).trim() : '';
      if (!key) {
        setToast({
          visible: true,
          message: 'Não foi possível excluir: WhatsApp do contato ausente.',
          variant: 'error',
        });
        return;
      }
      try {
        await deleteContato({ WhatsApp: key }, authHeader);
        if (
          selectedContatoRow &&
          getContatoRowKey(selectedContatoRow, 0) === getContatoRowKey(targetRow, 0)
        ) {
          setSelectedContatoKey(null);
          setMaisInfoValues(createInitialMaisInfoValues());
        }
        setToast({
          visible: true,
          message: 'Contato removido com sucesso.',
          variant: 'success',
        });
        await loadContatos();
      } catch (err) {
        setToast({
          visible: true,
          message: err?.message || 'Não foi possível excluir o contato.',
          variant: 'error',
        });
      }
    },
    [getAuthHeader, loadContatos, selectedContatoRow],
  );

  const handleLogout = async () => {
    sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
    supabase.auth.signOut().catch(() => {});
    window.location.replace(ROUTES.AUTH.LOGIN);
  };

  return (
    <StyledContatos className="contatos">
      <Header
        left={<Logo />}
        center={<MainNavigation />}
        right={
          <AuthenticatedHeaderRight
            role={role}
            onLogout={handleLogout}
            email={credentials?.username}
            iconSvg={PROFILE_ICON}
          />
        }
        isAuthenticated={isAuthenticated}
      />

      <StatsGrid stats={stats} sectionTitle="Informações Gerais" />

      <StyledMainContent className="contatos__content">
        <StyledContatosHeadingRow className="contatos__heading-row">
          <ContatosSectionHeading className="contatos__heading">
            Contatos
          </ContatosSectionHeading>
          <nav className="contatos__pill-nav" aria-label="Modo de contatos">
            <ContatosNavPill className="contatos__pill">
              <ContatosNavSegment
                type="button"
                className="contatos__pill-segment contatos__pill-segment--todos"
                $active={contatosPillMode === 'todos'}
                aria-pressed={contatosPillMode === 'todos'}
                onClick={() => setContatosPillMode('todos')}
              >
                Todos
              </ContatosNavSegment>
              <ContatosNavSegment
                type="button"
                className="contatos__pill-segment contatos__pill-segment--novo"
                $active={contatosPillMode === 'novo'}
                aria-pressed={contatosPillMode === 'novo'}
                onClick={() => {
                  setContatosPillMode('novo');
                  setSelectedContatoKey(null);
                }}
              >
                Novo
              </ContatosNavSegment>
            </ContatosNavPill>
          </nav>
        </StyledContatosHeadingRow>
        <SearchableLayout
          placeholder={contatosSearchPlaceholder}
          onSearchChange={setContatosSearch}
          initialSearchValue={contatosSearch}
          filterFields={CONTATOS_FILTER_FIELDS}
          onFilterFieldSelect={handleContatosFilterFieldSelect}
          twoColumnContent
          tabs={
            <Tabs
              tabs={CONTATOS_TABS}
              activeTab={activeContatosTab}
              onTabClick={setActiveContatosTab}
            />
          }
        >
          <ContatosContactForm
            mode={contatosPillMode}
            prefillKey={selectedContatoKey}
            prefillDadosPrincipais={prefillDadosPrincipais}
            onMaisInformacoesClick={() => setMaisInfoOpen(true)}
            onMainFormSave={handleMainFormSave}
            showMaisInfoAttention={false}
            maisInfoAttentionHint=""
          />
          <ContatosRightPane
            className="contatos__detail-pane"
            aria-label="Lista de contatos"
          >
            <ContatosListHeading>Lista de contatos</ContatosListHeading>
            {contatosLoadError ? (
              <ContatosListError role="alert">{contatosLoadError}</ContatosListError>
            ) : contatosLoading ? (
              <ContatosListEmpty>Carregando contatos…</ContatosListEmpty>
            ) : contatosLista.length === 0 ? (
              <ContatosListEmpty>Nenhum contato cadastrado.</ContatosListEmpty>
            ) : contatosFiltrados.length === 0 ? (
              <ContatosListEmpty>Nenhum resultado para a busca.</ContatosListEmpty>
            ) : (
              <ContatosListUl>
                {contatosFiltrados.map((row, idx) => {
                  const fullIdx = contatosLista.indexOf(row);
                  const rowKey = getContatoRowKey(
                    row,
                    fullIdx >= 0 ? fullIdx : idx,
                  );
                  const nome = row.Nome ?? row['Nome'] ?? '—';
                  const metaParts = [
                    row.WhatsApp ?? row['WhatsApp'],
                    row.Cidade ?? row['Cidade'],
                    row.Bairro ?? row['Bairro'],
                  ].filter(Boolean);
                  const isSelected = selectedContatoKey === rowKey;
                  return (
                    <ContatosListItem
                      key={rowKey}
                      $selected={isSelected}
                      className="contatos__list-item"
                    >
                      <ContatosListRowActions>
                        <ContatosListRowButton
                          type="button"
                          className="contatos__list-row-button"
                          aria-pressed={isSelected}
                          aria-label={`Abrir contato: ${nome}`}
                          onClick={() => handleSelectContatoRow(row)}
                        >
                          <ContatosListItemTitle>{nome}</ContatosListItemTitle>
                          <ContatosListItemMeta>
                            {metaParts.length ? metaParts.join(' · ') : '—'}
                          </ContatosListItemMeta>
                        </ContatosListRowButton>
                        <ContatosDeleteButton
                          type="button"
                          className="contatos__list-delete-button"
                          aria-label={`Excluir contato: ${nome}`}
                          title={`Excluir contato: ${nome}`}
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteContato(row);
                          }}
                        >
                          🗑
                        </ContatosDeleteButton>
                      </ContatosListRowActions>
                    </ContatosListItem>
                  );
                })}
              </ContatosListUl>
            )}
          </ContatosRightPane>
        </SearchableLayout>
        <ContatosMaisInformacoesModal
          isOpen={maisInfoOpen}
          onClose={() => setMaisInfoOpen(false)}
          values={maisInfoValues}
          onMaisInfoChange={handleMaisInfoChange}
          onSaveInformacoesAdicionais={handleSaveInformacoesAdicionais}
          getAuthHeader={getAuthHeader}
        />
        <Toast
          message={toast.message}
          visible={toast.visible}
          onClose={handleCloseToast}
          isMobile={isMobile}
          variant={toast.variant}
          icon={
            toast.variant === 'warning'
              ? '⚠'
              : toast.variant === 'error'
                ? '✕'
                : '✓'
          }
        />
      </StyledMainContent>
    </StyledContatos>
  );
};

