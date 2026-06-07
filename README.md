# 🌿 GuardaAgro — Análise de Risco Ambiental com Dados Espaciais da NASA

<p align="center">
  <strong>Plataforma inteligente de monitoramento ambiental usando dados orbitais e climáticos da NASA para prevenção de desastres</strong>
</p>

---

## 📋 Sobre o Projeto

O **GuardaAgro** é uma plataforma web que utiliza dados espaciais e climáticos da NASA para analisar riscos ambientais em regiões informadas pelo usuário. A aplicação calcula um **índice de risco ambiental de 0 a 100** considerando temperatura, umidade, precipitação, vento, radiação solar e focos de calor detectados por satélites.

### Problema

Produtores rurais, defesa civil, prefeituras e comunidades vulneráveis frequentemente enfrentam desastres ambientais (secas, queimadas, ondas de calor) sem acesso antecipado a dados precisos de monitoramento climático e espacial.

### Solução

O GuardaAgro conecta a **economia espacial** com um problema real da sociedade, utilizando dados de satélites da NASA para fornecer:

- 📊 Análise climática detalhada (temperatura, umidade, precipitação, vento, radiação)
- 🔥 Detecção de focos de calor por satélites (VIIRS/MODIS)
- 🛡️ Índice de risco ambiental calculado com base em múltiplos fatores
- 📋 Recomendações de ação baseadas no nível de risco
- 📈 Histórico de análises para acompanhamento temporal

---

## 🚀 Tecnologias

### Backend
| Tecnologia | Descrição |
|---|---|
| [Bun](https://bun.sh/) | Runtime JavaScript ultrarrápido |
| [ElysiaJS](https://elysiajs.com/) | Framework web de alta performance |
| TypeScript | Tipagem estática |
| NASA POWER API | Dados climáticos/meteorológicos |
| NASA FIRMS API | Focos de calor por satélite |

### Frontend
| Tecnologia | Descrição |
|---|---|
| [Vite](https://vitejs.dev/) | Build tool moderna |
| [React 19](https://react.dev/) | Biblioteca de UI |
| TypeScript | Tipagem estática |
| [HeroUI](https://www.heroui.com/) | Biblioteca de componentes |
| [Highcharts](https://www.highcharts.com/) | Gráficos interativos |
| [Firebase Auth](https://firebase.google.com/docs/auth) | Autenticação |
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | Banco de dados (histórico) |
| TailwindCSS | Estilização |
| Framer Motion | Animações |

### Infraestrutura
| Tecnologia | Descrição |
|---|---|
| [Vercel](https://vercel.com/) | Hospedagem serverless (Frontend + Backend) |
| Bun Runtime | Runtime para API serverless no Vercel |
| Docker | Containerização (desenvolvimento local) |
| Docker Compose | Orquestração (desenvolvimento local) |

---

## 🛰️ APIs NASA Utilizadas

### NASA POWER API
Fornece dados climáticos e meteorológicos por coordenada geográfica:
- **T2M** — Temperatura média a 2 metros (°C)
- **T2M_MAX** — Temperatura máxima (°C)
- **T2M_MIN** — Temperatura mínima (°C)
- **RH2M** — Umidade relativa (%)
- **PRECTOTCORR** — Precipitação total corrigida (mm/dia)
- **WS2M** — Velocidade do vento (m/s)
- **ALLSKY_SFC_SW_DWN** — Radiação solar (kWh/m²/dia)

> 📖 [Documentação NASA POWER](https://power.larc.nasa.gov/docs/)

### NASA FIRMS API
Detecta focos de calor/incêndios ativos via satélites:
- **VIIRS_SNPP_NRT** — Sensor VIIRS no satélite Suomi NPP
- **MODIS_NRT** — Sensor MODIS nos satélites Terra/Aqua

> 📖 [Documentação NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/area/)

---

## ⚙️ Configuração

### 1. Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** → **Email/Password**
4. Ative **Cloud Firestore** → Crie um banco de dados
5. No Firestore, crie um índice composto:
   - Coleção: `analyses`
   - Campos: `userId` (Ascending) + `createdAt` (Descending)
6. Copie as configurações do Firebase para o `.env` do frontend

### 2. NASA FIRMS API Key (Opcional)

1. Acesse [NASA FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/area/)
2. Solicite uma MAP_KEY gratuita
3. Configure a variável `NASA_FIRMS_API_KEY` no `.env` do backend

> ⚠️ Se a chave não for configurada, a aplicação funcionará normalmente, porém sem dados de focos de calor.

---

## 🏃 Como Rodar

### Localmente (sem Docker)

#### Backend

```bash
cd backend
cp .env.example .env
# Edite .env com sua NASA_FIRMS_API_KEY (opcional)

bun install
bun run dev
```

O backend estará disponível em `http://localhost:3001`.

#### Frontend

```bash
cd frontend
cp .env.example .env
# Edite .env com suas credenciais Firebase

npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

### Com Docker Compose

```bash
# Crie um arquivo .env na raiz com as variáveis necessárias
cp backend/.env.example .env
# Adicione também as variáveis VITE_FIREBASE_* ao .env

docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## 🚀 Deploy no Vercel

O GuardaAgro está configurado para deploy automático no Vercel com backend ElysiaJS rodando em Bun runtime.

### Pré-requisitos

1. Conta no [Vercel](https://vercel.com/)
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. Credenciais do Firebase (Service Account JSON)
4. NASA FIRMS API Key (opcional)

### Passo a Passo

#### 1. Conectar Repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório Git
3. O Vercel detectará automaticamente as configurações do `vercel.json`

#### 2. Configurar Variáveis de Ambiente

No dashboard do Vercel, vá em **Settings** → **Environment Variables** e adicione:

**Frontend (VITE_*):**
```bash
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

**Backend (API):**
```bash
NASA_FIRMS_API_KEY=sua-chave-nasa-firms
NASA_FIRMS_SOURCE=VIIRS_SNPP_NRT
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua-Chave-Privada\n-----END PRIVATE KEY-----\n"
```

> 💡 **Dica**: Para a `FIREBASE_PRIVATE_KEY`, certifique-se de incluir as aspas e manter os `\n` para quebras de linha.

#### 3. Obter Service Account do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Project Settings** → **Service Accounts**
3. Clique em **Generate new private key**
4. Copie as credenciais do JSON baixado para as variáveis de ambiente

#### 4. Deploy

1. Clique em **Deploy** no Vercel
2. Aguarde o build (2-3 minutos)
3. Acesse a URL gerada: `https://seu-projeto.vercel.app`

### Verificação Pós-Deploy

Teste os seguintes endpoints:
- ✅ `https://seu-projeto.vercel.app/` — Frontend carrega
- ✅ `https://seu-projeto.vercel.app/api/health` — API responde
- ✅ Login com Firebase Auth funciona
- ✅ Análise de região retorna dados
- ✅ Histórico salva e recupera corretamente

### Troubleshooting

**Erro: "Function not found"**
- Verifique se `api/index.ts` existe e está configurado corretamente no `vercel.json`

**Erro: "Firebase Admin SDK not initialized"**
- Confirme que todas as variáveis `FIREBASE_*` foram configuradas
- Verifique se a `FIREBASE_PRIVATE_KEY` contém os `\n` corretos

**Erro: "CORS blocked"**
- O CORS está configurado para aceitar `*.vercel.app` automaticamente

**Build falha no Vercel**
- Verifique os logs em **Deployments** → clique no deploy → **Build Logs**
- Certifique-se de que todas as dependências do frontend estão no `package.json`

---

## 🎬 Roteiro de Demonstração (Vídeo)

1. **Login**: Mostrar tela de login, criar conta e fazer login
2. **Dashboard**: Apresentar o painel principal e explicar o objetivo
3. **Análise**: Usar sugestão rápida "Amazônia" e clicar em "Analisar região"
4. **Resultados**: Mostrar cards climáticos, gráficos e índice de risco
5. **Focos de calor**: Mostrar tabela de focos (se disponível)
6. **Histórico**: Mostrar histórico salvo e clicar em análise anterior
7. **Outra região**: Analisar "São Paulo" para comparar resultados

### Prints Sugeridos
- Tela de login (dark mode)
- Dashboard com cards climáticos
- Gauge de risco ambiental
- Gráfico de dados climáticos
- Tabela de focos de calor
- Painel de histórico

---

## 🌍 Impacto Esperado

O GuardaAgro pode beneficiar:
- **Produtores rurais**: Monitoramento proativo de condições climáticas adversas
- **Defesa civil**: Alertas antecipados de risco de queimadas e secas
- **Prefeituras**: Dados para tomada de decisão em políticas de prevenção
- **Comunidades vulneráveis**: Informação acessível sobre riscos ambientais
- **Pesquisadores**: Ferramenta de análise com dados NASA de fácil acesso

---

## 📐 Estrutura do Projeto

```
GuardaAgro/
├── api/
│   └── index.ts                      # Entry point Vercel (Bun runtime)
├── backend/
│   ├── src/
│   │   ├── index.ts                  # Entry point local (desenvolvimento)
│   │   ├── config/
│   │   │   └── firebase.ts           # Configuração Firebase Admin
│   │   ├── modules/
│   │   │   ├── analysis/
│   │   │   │   ├── controllers/
│   │   │   │   ├── models/
│   │   │   │   ├── repositories/
│   │   │   │   ├── routes/
│   │   │   │   └── services/
│   │   │   └── nasa/
│   │   │       ├── controllers/
│   │   │       ├── models/
│   │   │       ├── repositories/
│   │   │       ├── routes/
│   │   │       └── services/
│   │   └── utils/
│   │       ├── date.ts              # Utilitários de data
│   │       └── geo.ts              # Utilitários geográficos
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                  # Entry point React
│   │   ├── App.tsx                   # Componente raiz + rotas
│   │   ├── firebase.ts              # Configuração Firebase Auth
│   │   ├── routes/
│   │   │   ├── LoginPage.tsx         # Tela de login/cadastro
│   │   │   └── DashboardPage.tsx     # Dashboard principal
│   │   ├── components/
│   │   │   ├── AppNavbar.tsx         # Barra de navegação
│   │   │   ├── AnalysisForm.tsx      # Formulário de análise
│   │   │   ├── RiskGauge.tsx         # Gauge de risco (Highcharts)
│   │   │   ├── ClimateCards.tsx      # Cards climáticos
│   │   │   ├── ClimateChart.tsx      # Gráfico climático
│   │   │   ├── FireTable.tsx         # Tabela de focos de calor
│   │   │   └── HistoryPanel.tsx      # Painel de histórico
│   │   ├── services/
│   │   │   ├── api.ts               # Cliente HTTP
│   │   │   └── history.service.ts   # Serviço de histórico
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx       # Context de autenticação
│   │   ├── types/
│   │   │   └── analysis.ts          # Tipos TypeScript
│   │   └── styles/
│   │       └── globals.css          # Estilos globais (dark mode)
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── vercel.json                       # Configuração Vercel
├── package.json                      # Scripts raiz
├── docker-compose.yml               # Docker (desenvolvimento local)
└── README.md
```

---

## 🎓 Contexto Acadêmico

**Atividade**: Global Solution 1 — Space Connect  
**Instituição**: FIAP  
**Objetivo**: Conectar economia espacial com um problema real da sociedade

## Links de referência — APIs NASA e Tecnologias

### NASA POWER API
- Documentação: https://power.larc.nasa.gov/docs/
- API Explorer: https://power.larc.nasa.gov/data-access-viewer/
- Endpoint Daily Point: https://power.larc.nasa.gov/api/temporal/daily/point

### NASA FIRMS API
- Página principal: https://firms.modaps.eosdis.nasa.gov/
- Documentação da API: https://firms.modaps.eosdis.nasa.gov/api/area/
- Obter MAP_KEY: https://firms.modaps.eosdis.nasa.gov/api/area/

### Firebase
- Console: https://console.firebase.google.com/
- Documentação Auth: https://firebase.google.com/docs/auth
- Documentação Firestore: https://firebase.google.com/docs/firestore

### Tecnologias
- Bun: https://bun.sh/
- ElysiaJS: https://elysiajs.com/
- Vite: https://vitejs.dev/
- React: https://react.dev/
- HeroUI: https://www.heroui.com/
- Highcharts: https://www.highcharts.com/
- TailwindCSS: https://tailwindcss.com/
- Framer Motion: https://www.framer.com/motion/

---

## 👥 Integrantes

| Nome | RM |
|---|---|
| _Felipe Rocha Oliveira_ | _RM99653_ |

---

### 📄 Licença

Este projeto é parte de uma atividade acadêmica da FIAP e está disponível apenas para fins educacionais.
