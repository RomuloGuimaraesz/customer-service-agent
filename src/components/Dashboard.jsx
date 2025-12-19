import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { StatsCard } from './StatsCard';
import { CardList } from './CardList';

/**
 * Dashboard Component
 */
export const Dashboard = () => {
  const { logout, credentials } = useAuth();
  const {
    pedidos,
    agendamentos,
    loading,
    error,
    lastUpdated,
    activeTab,
    setActiveTab,
    refreshAll,
  } = useAdmin();

  const stats = {
    totalPedidos: pedidos.length,
    pedidosPendentes: pedidos.filter(p =>
      p.Status?.toLowerCase().includes('aguardando') ||
      p.Status?.toLowerCase().includes('produção')
    ).length,
    totalAgendamentos: agendamentos.length,
    agendamentosHoje: agendamentos.filter(a =>
      a.Data?.includes(new Date().toLocaleDateString('pt-BR'))
    ).length,
  };

  // Load SVG icons
  const calendarIcon = `<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.875 7.275H0.875M10.9861 0.875V4.075M4.76389 0.875V4.075M4.60833 16.875H11.1417C12.4485 16.875 13.1019 16.875 13.601 16.6134C14.04 16.3833 14.397 16.0162 14.6207 15.5646C14.875 15.0512 14.875 14.3791 14.875 13.035V6.315C14.875 4.97087 14.875 4.29881 14.6207 3.78542C14.397 3.33383 14.04 2.96668 13.601 2.73658C13.1019 2.475 12.4485 2.475 11.1417 2.475H4.60833C3.30154 2.475 2.64815 2.475 2.14902 2.73658C1.70998 2.96668 1.35302 3.33383 1.12932 3.78542C0.875 4.29881 0.875 4.97087 0.875 6.315V13.035C0.875 14.3791 0.875 15.0512 1.12932 15.5646C1.35302 16.0162 1.70998 16.3833 2.14902 16.6134C2.64815 16.875 3.30154 16.875 4.60833 16.875Z" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const documentIcon = `<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.0515 9.275V4.715C14.0515 3.37087 14.0515 2.69881 13.7822 2.18542C13.5453 1.73383 13.1674 1.36668 12.7025 1.13658C12.174 0.875 11.4822 0.875 10.0985 0.875H4.82794C3.44428 0.875 2.75245 0.875 2.22396 1.13658C1.75909 1.36668 1.38114 1.73383 1.14428 2.18542C0.875 2.69881 0.875 3.37087 0.875 4.715V13.035C0.875 14.3791 0.875 15.0512 1.14428 15.5646C1.38114 16.0162 1.75909 16.3833 2.22396 16.6134C2.75245 16.875 3.44424 16.875 4.82782 16.875H7.875M9.11029 8.075H4.16912M5.81618 11.275H4.16912M10.7574 4.875H4.16912M9.93382 14.475L12.4044 16.875M12.4044 16.875L14.875 14.475M12.4044 16.875V12.075" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const warningIcon = `<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.875 6.65513V10.2099M9.875 13.7646H9.88377M8.66077 2.11548L1.44837 14.7407C1.04832 15.441 0.8483 15.7911 0.877863 16.0785C0.903649 16.3291 1.03323 16.5569 1.23435 16.7051C1.46494 16.875 1.86416 16.875 2.6626 16.875H17.0874C17.8858 16.875 18.2851 16.875 18.5156 16.7051C18.7168 16.5569 18.8464 16.3291 18.8721 16.0785C18.9017 15.7911 18.7017 15.441 18.3016 14.7407L11.0892 2.11548C10.6906 1.41771 10.4913 1.06883 10.2313 0.951658C10.0045 0.849447 9.74553 0.849447 9.51872 0.951658C9.25869 1.06883 9.05938 1.41772 8.66077 2.11548Z" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const messageIcon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.43068 5.64214H8.87512M4.43068 8.67578H11.5418M4.43068 13.8763V15.9006C4.43068 16.3625 4.43068 16.5934 4.52777 16.712C4.61221 16.8151 4.74025 16.8751 4.8756 16.875C5.03124 16.8748 5.21616 16.7306 5.58602 16.4421L7.70642 14.788C8.13958 14.4501 8.35616 14.2811 8.59733 14.161C8.8113 14.0544 9.03906 13.9765 9.27442 13.9294C9.53972 13.8763 9.81707 13.8763 10.3718 13.8763H12.6085C14.1019 13.8763 14.8487 13.8763 15.4191 13.5929C15.9209 13.3436 16.3288 12.9458 16.5845 12.4565C16.8751 11.9003 16.8751 11.1722 16.8751 9.71589V5.03542C16.8751 3.57913 16.8751 2.85099 16.5845 2.29477C16.3288 1.8055 15.9209 1.40771 15.4191 1.15841C14.8487 0.875 14.1019 0.875 12.6085 0.875H5.14179C3.64832 0.875 2.90158 0.875 2.33115 1.15841C1.82938 1.40771 1.42143 1.8055 1.16577 2.29477C0.875122 2.85099 0.875122 3.57913 0.875122 5.03542V10.4093C0.875122 11.2153 0.875122 11.6184 0.965987 11.949C1.21257 12.8464 1.93136 13.5473 2.8516 13.7877C3.19072 13.8763 3.60404 13.8763 4.43068 13.8763Z" stroke="#5B5E55" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const profileIcon = `<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 16.75C2.95602 14.4183 5.95107 12.9853 9.25 12.9853C12.5489 12.9853 15.544 14.4183 17.75 16.75M13.5 4.98529C13.5 7.32438 11.5972 9.22059 9.25 9.22059C6.90279 9.22059 5 7.32438 5 4.98529C5 2.64621 6.90279 0.75 9.25 0.75C11.5972 0.75 13.5 2.64621 13.5 4.98529Z" stroke="#5B5E55" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      color: '#111827',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {lastUpdated.pedidos && (
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              Atualizado: {lastUpdated.pedidos.toLocaleTimeString('pt-BR')}
            </span>
          )}

          <button
            onClick={refreshAll}
            disabled={loading.pedidos || loading.agendamentos}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '500',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#111827',
              cursor: 'pointer',
              opacity: loading.pedidos || loading.agendamentos ? 0.7 : 1,
            }}
          >
            Atualizar
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} dangerouslySetInnerHTML={{ __html: profileIcon }} />
        </div>
              {/*credentials.username*/}
            </span>
            <button
              onClick={logout}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#dc2626',
                cursor: 'pointer',
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
        {/* Title */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 24px 0',
        }}>
          Status Geral
        </h1>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <StatsCard iconSvg={calendarIcon} label="Agendamentos" value={stats.totalAgendamentos} />
          <StatsCard iconSvg={documentIcon} label="Pedidos" value={stats.totalPedidos} />
          <StatsCard iconSvg={warningIcon} label="Pendentes" value={stats.pedidosPendentes} />
          <StatsCard iconSvg={messageIcon} label="Hoje" value={stats.agendamentosHoje} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '16px',
        }}>
          {[
            { id: 'agendamentos', label: 'Agendamentos', count: agendamentos.length },
            { id: 'pedidos', label: 'Pedidos', count: pedidos.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#111827' : '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
              <span style={{
                padding: '2px 6px',
                fontSize: '12px',
                borderRadius: '10px',
                backgroundColor: activeTab === tab.id ? '#f3f4f6' : '#f9fafb',
                color: activeTab === tab.id ? '#111827' : '#6b7280',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Error State */}
        {(error.pedidos || error.agendamentos) && (
          <div style={{
            padding: '16px 20px',
            marginBottom: '20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '13px',
          }}>
            ⚠️ Usando dados de demonstração. Erro: {error.pedidos || error.agendamentos}
          </div>
        )}

        {/* Card Lists */}
        {activeTab === 'pedidos' && (
          <CardList data={pedidos} type="pedidos" />
        )}
        {activeTab === 'agendamentos' && (
          <CardList data={agendamentos} type="agendamentos" />
        )}
      </main>

      {/* CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f5f5f5; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};


