# Smoke Test - Analytics RLS (Correção UPDATE/DELETE)

## Contexto

As policies de INSERT e SELECT já existiam. Faltavam **UPDATE** e **DELETE**, causando falha silenciosa no tracking:

- **endTabSession** faz `.update({ duration })` → bloqueado sem policy UPDATE
- **clearAnalyticsData** faz `.delete()` → bloqueado sem policy DELETE

## Checklist de Smoke Test

### 1. Login como admin → navegar entre tabs

- [ ] Abrir DevTools (F12) → aba Console
- [ ] Login com conta **admin**
- [ ] Navegar entre Pedidos, Agendamentos, WhatsApp (várias vezes)
- [ ] **Verificar:** não há erros `"Erro ao registrar clique:"` ou `"Erro ao iniciar sessão:"` no console

### 2. Login como architect → modal de Estatísticas

- [ ] Login com conta **architect**
- [ ] Clicar no botão **Estatísticas** no header
- [ ] **Verificar:** os eventos da admin aparecem com cliques, tempo e sessões
- [ ] **Verificar:** dados exibidos por usuário (admin) e por tab

### 3. Botão "Limpar Dados" (architect)

- [ ] Com architect logado, abrir modal de Estatísticas
- [ ] Clicar em **Limpar Dados**
- [ ] Confirmar no diálogo
- [ ] **Verificar:** não há erro no console
- [ ] **Verificar:** os dados são removidos (ex.: mensagem de vazio ou lista vazia)

### 4. Botão "Exportar Dados" (architect)

- [ ] Com architect logado, abrir modal de Estatísticas
- [ ] Clicar em **Exportar Dados (JSON)**
- [ ] **Verificar:** arquivo JSON é baixado
- [ ] **Verificar:** o JSON contém `rawData.events`, `statistics` e `exportedAt`

### 5. Verificação no banco

No Supabase SQL Editor:

```sql
SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 20;
```

- [ ] **Verificar:** existem eventos após navegação como admin (tab_click, tab_session)
- [ ] **Verificar:** eventos de sessão têm `duration` preenchido após troca de tab

## Resumo das Policies

| Operação | Policy          | Quem pode              |
|----------|-----------------|------------------------|
| INSERT   | (já existia)    | Usuários autenticados  |
| UPDATE   | (corrigida)     | Usuários autenticados (user_id = auth.uid()) |
| SELECT   | (já existia)    | Architect vê todos     |
| DELETE   | (corrigida)     | Apenas architect       |
