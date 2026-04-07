# Avecta AI Admin

Painel administrativo para gestão de pedidos, agendamentos e WhatsApp Business.

## Estrutura do Projeto

```
0-avecta/
├── frontend/          # Aplicação React/Vite
│   ├── src/          # Código-fonte
│   ├── dist/         # Build de produção
│   ├── assets/       # Assets estáticos
│   ├── package.json  # Dependências do frontend
│   └── vite.config.js
├── backend/          # Backend (a ser criado)
└── README.md         # Este arquivo
```

## Frontend

### Tecnologias

- React 18
- Vite
- Vitest (testes)

### Configuração

Antes de executar a aplicação, você precisa configurar as variáveis de ambiente do Supabase.

1. Crie um arquivo `.env` na pasta `frontend/` com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

2. Você pode encontrar essas credenciais no seu projeto Supabase:
   - Acesse: https://app.supabase.com/project/_/settings/api
   - Copie a **URL do projeto** para `VITE_SUPABASE_URL`
   - Copie a **chave anônima (anon key)** para `VITE_SUPABASE_KEY`

### Comandos

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Testes
npm test

# Preview do build
npm run preview
```

### Estrutura do Frontend

```
frontend/
├── src/
│   ├── components/       # Componentes React
│   │   └── whatsapp/    # Componentes do WhatsApp
│   ├── contexts/         # Context API (Auth, Admin)
│   ├── config/          # Configurações e constantes
│   ├── data/            # Dados mock
│   └── test/            # Configuração de testes
├── assets/              # Assets estáticos
├── index.html
└── main.jsx
```

## Próximos Passos

- [ ] Criar backend para integração com WhatsApp Business API
- [ ] Configurar banco de dados
- [ ] Implementar webhooks do WhatsApp
- [ ] Integrar frontend com novo backend












