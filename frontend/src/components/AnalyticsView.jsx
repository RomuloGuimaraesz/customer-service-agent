import React, { useState, useEffect } from 'react';
import { getUsageStatistics, exportAnalyticsData, clearAnalyticsData, getEventsByPeriod } from '../services/analytics';
import styled from 'styled-components';
import { StatsGrid } from './StatsGrid';
import { CALENDAR_ICON } from '../config/icons';

/**
 * Analytics View Container - BEM: analytics-view
 */
const StyledAnalyticsView = styled.div`
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  max-width: 1200px;
  margin: 0 auto;
`;

/**
 * Analytics Header - BEM: analytics-view__header
 */
const StyledAnalyticsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.lg};
`;

/**
 * Analytics Title - BEM: analytics-view__title
 */
const StyledAnalyticsTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

/**
 * Analytics Subtitle - BEM: analytics-view__subtitle
 */
const StyledAnalyticsSubtitle = styled.p`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

/**
 * Close Button - BEM: analytics-view__close-button
 */
const StyledCloseButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * Period Filter Container - BEM: analytics-view__period-filter
 */
const StyledPeriodFilter = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

/**
 * Period Label - BEM: analytics-view__period-label
 */
const StyledPeriodLabel = styled.label`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

/**
 * Period Select - BEM: analytics-view__period-select
 */
const StyledPeriodSelect = styled.select`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.xs};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
`;

/**
 * Refresh Button - BEM: analytics-view__refresh-button
 */
const StyledRefreshButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.xs};
  background-color: ${props => props.theme.colors.background.tertiary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.background.primary};
  }
`;

// Simple SVG icons for stats
const CLICKS_ICON = `<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.875 1.125L10.375 6.625L15.875 8.125L10.375 9.625L8.875 15.125L7.375 9.625L1.875 8.125L7.375 6.625L8.875 1.125Z" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const TIME_ICON = `<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8.875" cy="9.125" r="6.5" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.875 4.625V9.125L12.375 11.625" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/**
 * Stat Label - BEM: analytics-view__stat-label
 * Used in tab card stats section
 */
const StyledStatLabel = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

/**
 * Stat Value Small - BEM: analytics-view__stat-value--small
 * Used in tab card stats section
 */
const StyledStatValueSmall = styled.div`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Section Title - BEM: analytics-view__section-title
 */
const StyledSectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

/**
 * Tabs Grid - BEM: analytics-view__tabs-grid
 */
const StyledTabsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

/**
 * Tab Card - BEM: analytics-view__tab-card
 */
const StyledTabCard = styled.div`
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Tab Card Header - BEM: analytics-view__tab-card-header
 */
const StyledTabCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Tab Card Title - BEM: analytics-view__tab-card-title
 */
const StyledTabCardTitle = styled.h4`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
`;

/**
 * Tab Card Subtitle - BEM: analytics-view__tab-card-subtitle
 */
const StyledTabCardSubtitle = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Tab Card Stats Grid - BEM: analytics-view__tab-card-stats
 */
const StyledTabCardStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

/**
 * Tab Card Stat Item - BEM: analytics-view__tab-card-stat
 */
const StyledTabCardStatItem = styled.div``;

/**
 * Tab Card Stat Percentage - BEM: analytics-view__tab-card-stat-percentage
 */
const StyledTabCardStatPercentage = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  margin-top: 2px;
`;

/**
 * Progress Bar Container - BEM: analytics-view__progress-container
 */
const StyledProgressContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

/**
 * Progress Bar Row - BEM: analytics-view__progress-row
 */
const StyledProgressRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

/**
 * Progress Bar Wrapper - BEM: analytics-view__progress-wrapper
 */
const StyledProgressWrapper = styled.div`
  flex: 1;
`;

/**
 * Progress Bar Track - BEM: analytics-view__progress-track
 */
const StyledProgressTrack = styled.div`
  height: 8px;
  background-color: ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.spacing.xs};
  overflow: hidden;
`;

/**
 * Progress Bar Fill - BEM: analytics-view__progress-fill
 */
const StyledProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => props.color};
  transition: width ${props => props.theme.transitions.slow} ease;
`;

/**
 * Progress Bar Label - BEM: analytics-view__progress-label
 */
const StyledProgressLabel = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  margin-top: ${props => props.theme.spacing.xs};
`;

/**
 * Actions Container - BEM: analytics-view__actions
 */
const StyledActionsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing['2xl']};
  border-top: 1px solid ${props => props.theme.colors.border.primary};
  flex-wrap: wrap;
`;

/**
 * Export Button - BEM: analytics-view__export-button
 */
const StyledExportButton = styled.button`
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.status.info};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.status.info};
  color: ${props => props.theme.colors.text.light};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

/**
 * Clear Button - BEM: analytics-view__clear-button
 */
const StyledClearButton = styled.button`
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.status.error};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.status.error};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.status.errorBg};
  }
`;

/**
 * Info Box - BEM: analytics-view__info-box
 */
const StyledInfoBox = styled.div`
  margin-top: ${props => props.theme.spacing['2xl']};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.status.infoBg};
  border-radius: ${props => props.theme.borderRadius.xs};
  border: 1px solid ${props => props.theme.colors.border.info};
`;

/**
 * Info Text - BEM: analytics-view__info-text
 */
const StyledInfoText = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.status.infoText};
  margin: 0;
  line-height: 1.5;
`;

/**
 * Componente de Visualização de Analytics/Estatísticas de Uso
 */
export const AnalyticsView = ({ onClose }) => {
  const [stats, setStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

  const loadStatistics = () => {
    const statistics = getUsageStatistics();
    const events = getEventsByPeriod(selectedPeriod);
    setStats(statistics);
    setRecentEvents(events);
  };

  const handleExport = () => {
    const data = exportAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapidy-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados de analytics? Esta ação não pode ser desfeita.')) {
      clearAnalyticsData();
      loadStatistics();
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR');
  };

  if (!stats) {
    return (
      <StyledAnalyticsView className="analytics-view">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Carregando estatísticas...</p>
        </div>
      </StyledAnalyticsView>
    );
  }

  const tabs = [
    { id: 'agendamentos', name: 'Agendamentos' },
    { id: 'pedidos', name: 'Pedidos' },
    { id: 'whatsapp', name: 'WhatsApp' },
  ];

  // Ordenar tabs por número de cliques (decrescente)
  const sortedTabs = tabs
    .map(tab => ({
      ...tab,
      ...stats.tabs[tab.id],
    }))
    .sort((a, b) => b.clicks - a.clicks);

  // Calcular percentuais
  const totalClicksPercentage = stats.totalClicks > 0 ? 100 : 0;
  const totalTimePercentage = stats.totalTime > 0 ? 100 : 0;

  return (
    <StyledAnalyticsView className="analytics-view">
      {/* Header */}
      <StyledAnalyticsHeader className="analytics-view__header">
        <div>
          <StyledAnalyticsTitle className="analytics-view__title">
            Estatísticas de Uso
          </StyledAnalyticsTitle>
          <StyledAnalyticsSubtitle className="analytics-view__subtitle">
            Análise de uso das abas do sistema
          </StyledAnalyticsSubtitle>
        </div>
        
        {onClose && (
          <StyledCloseButton
            onClick={onClose}
            className="analytics-view__close-button"
          >
            Fechar
          </StyledCloseButton>
        )}
      </StyledAnalyticsHeader>

      {/* Filtro de Período */}
      <StyledPeriodFilter className="analytics-view__period-filter">
        <StyledPeriodLabel className="analytics-view__period-label">
          Período:
        </StyledPeriodLabel>
        <StyledPeriodSelect
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          className="analytics-view__period-select"
        >
          <option value={1}>Último dia</option>
          <option value={7}>Últimos 7 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={90}>Últimos 90 dias</option>
          <option value={365}>Último ano</option>
          <option value={9999}>Todo o histórico</option>
        </StyledPeriodSelect>
        
        <StyledRefreshButton
          onClick={loadStatistics}
          className="analytics-view__refresh-button"
        >
          Atualizar
        </StyledRefreshButton>
      </StyledPeriodFilter>

      {/* Estatísticas Gerais */}
      <div style={{ marginBottom: '3rem' }}>
        <StatsGrid
          stats={[
            {
              iconSvg: CLICKS_ICON,
              label: 'Total de Cliques',
              value: stats.totalClicks
            },
            {
              iconSvg: TIME_ICON,
              label: 'Tempo Total',
              value: formatTime(stats.totalTime)
            },
            ...(stats.firstEvent ? [{
              iconSvg: CALENDAR_ICON,
              label: 'Primeiro Registro',
              value: formatDate(stats.firstEvent)
            }] : []),
            ...(stats.lastEvent ? [{
              iconSvg: CALENDAR_ICON,
              label: 'Último Registro',
              value: formatDate(stats.lastEvent)
            }] : [])
          ]}
        />
      </div>

      {/* Estatísticas por Tab */}
      <div>
        <StyledSectionTitle className="analytics-view__section-title">
          Estatísticas por Aba
        </StyledSectionTitle>
        
        <StyledTabsGrid className="analytics-view__tabs-grid">
          {sortedTabs.map((tab) => {
            const clickPercentage = stats.totalClicks > 0
              ? ((tab.clicks / stats.totalClicks) * 100).toFixed(1)
              : 0;
            const timePercentage = stats.totalTime > 0
              ? ((tab.totalTime / stats.totalTime) * 100).toFixed(1)
              : 0;

            return (
              <StyledTabCard key={tab.id} className="analytics-view__tab-card">
                <StyledTabCardHeader className="analytics-view__tab-card-header">
                  <div>
                    <StyledTabCardTitle className="analytics-view__tab-card-title">
                      {tab.name}
                    </StyledTabCardTitle>
                    <StyledTabCardSubtitle className="analytics-view__tab-card-subtitle">
                      {tab.id}
                    </StyledTabCardSubtitle>
                  </div>
                </StyledTabCardHeader>

                <StyledTabCardStatsGrid className="analytics-view__tab-card-stats">
                  <StyledTabCardStatItem className="analytics-view__tab-card-stat">
                    <StyledStatLabel className="analytics-view__stat-label">
                      Cliques
                    </StyledStatLabel>
                    <StyledStatValueSmall className="analytics-view__stat-value--small">
                      {tab.clicks}
                    </StyledStatValueSmall>
                    <StyledTabCardStatPercentage className="analytics-view__tab-card-stat-percentage">
                      {clickPercentage}% do total
                    </StyledTabCardStatPercentage>
                  </StyledTabCardStatItem>

                  <StyledTabCardStatItem className="analytics-view__tab-card-stat">
                    <StyledStatLabel className="analytics-view__stat-label">
                      Tempo Total
                    </StyledStatLabel>
                    <StyledStatValueSmall className="analytics-view__stat-value--small">
                      {formatTime(tab.totalTime)}
                    </StyledStatValueSmall>
                    <StyledTabCardStatPercentage className="analytics-view__tab-card-stat-percentage">
                      {timePercentage}% do total
                    </StyledTabCardStatPercentage>
                  </StyledTabCardStatItem>

                  <StyledTabCardStatItem className="analytics-view__tab-card-stat">
                    <StyledStatLabel className="analytics-view__stat-label">
                      Sessões
                    </StyledStatLabel>
                    <StyledStatValueSmall className="analytics-view__stat-value--small">
                      {tab.sessions}
                    </StyledStatValueSmall>
                  </StyledTabCardStatItem>

                  <StyledTabCardStatItem className="analytics-view__tab-card-stat">
                    <StyledStatLabel className="analytics-view__stat-label">
                      Tempo Médio
                    </StyledStatLabel>
                    <StyledStatValueSmall className="analytics-view__stat-value--small">
                      {formatTime(tab.averageTime || 0)}
                    </StyledStatValueSmall>
                  </StyledTabCardStatItem>
                </StyledTabCardStatsGrid>

                {/* Barra de progresso visual */}
                <StyledProgressContainer className="analytics-view__progress-container">
                  <StyledProgressRow className="analytics-view__progress-row">
                    <StyledProgressWrapper className="analytics-view__progress-wrapper">
                      <StyledProgressTrack className="analytics-view__progress-track">
                        <StyledProgressFill 
                          percentage={clickPercentage} 
                          color="#3b82f6"
                          className="analytics-view__progress-fill"
                        />
                      </StyledProgressTrack>
                      <StyledProgressLabel className="analytics-view__progress-label">
                        Cliques: {clickPercentage}%
                      </StyledProgressLabel>
                    </StyledProgressWrapper>
                    <StyledProgressWrapper className="analytics-view__progress-wrapper">
                      <StyledProgressTrack className="analytics-view__progress-track">
                        <StyledProgressFill 
                          percentage={timePercentage} 
                          color="#10b981"
                          className="analytics-view__progress-fill"
                        />
                      </StyledProgressTrack>
                      <StyledProgressLabel className="analytics-view__progress-label">
                        Tempo: {timePercentage}%
                      </StyledProgressLabel>
                    </StyledProgressWrapper>
                  </StyledProgressRow>
                </StyledProgressContainer>
              </StyledTabCard>
            );
          })}
        </StyledTabsGrid>
      </div>

      {/* Ações */}
      <StyledActionsContainer className="analytics-view__actions">
        <StyledExportButton
          onClick={handleExport}
          className="analytics-view__export-button"
        >
          Exportar Dados (JSON)
        </StyledExportButton>
        
        <StyledClearButton
          onClick={handleClear}
          className="analytics-view__clear-button"
        >
          Limpar Dados
        </StyledClearButton>
      </StyledActionsContainer>

      {/* Informação adicional */}
      <StyledInfoBox className="analytics-view__info-box">
        <StyledInfoText className="analytics-view__info-text">
          <strong>Nota:</strong> Os dados são armazenados localmente no navegador. Para manter os dados após limpar o cache, exporte-os regularmente.
          Sessões ativas são contabilizadas no tempo total mesmo que ainda não tenham sido finalizadas.
        </StyledInfoText>
      </StyledInfoBox>
    </StyledAnalyticsView>
  );
};
