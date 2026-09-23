# Verdant — Plant Shopping & Care Management Platform

Verdant is a production-ready botanical e-commerce and plant project management platform designed for indoor botanists, interior plant curators, and urban gardeners. It combines a plant specimen store, task management board, botanical spaces tracker, care timeline analytics, and an integrated AI horticultural assistant powered by Google Gemini.

---

## 🌿 Key Features

1. **Botanical Specimen Catalog & Shop**:
   - Filter by care difficulty, pet-friendliness, light requirements, and watering frequency.
   - Plant specimen details with botanical binomials, moisture schedules, and interactive cart drawer.
   - Automatic project task generation upon specimen purchase.

2. **Flora AI Assistant & Natural Language Search**:
   - **Interactive Horticultural Assistant**: Multiturn advice on watering diagnostics, repotting, pest control, and soil mixes. Generates actionable tasks directly from chat.
   - **Semantic Spotlight Search (`⌘K`)**: Natural language querying across tasks, spaces, plants, and care logs (e.g. *"urgent tasks due today"*, *"pet-safe low-light plants under $50"*).
   - Server-side Gemini API proxy using the `@google/genai` SDK (`gemini-3.8-flash`) ensuring zero API key exposure to the browser.
   - Built-in heuristic fallback engine ensuring search remains functional even without external AI keys.

3. **Care & Operations Kanban Board**:
   - Workflow columns: *To Do*, *In Progress*, and *Completed*.
   - Filter by care categories: Watering, Fertilizing, Repotting, Pest Care, Pruning, and Propagation.
   - Drag-and-drop or status toggling with real-time progress calculation.

4. **Botanical Spaces & Project Management**:
   - Track progress, budget expenditure, and vitality health indexes across living spaces (Aroid Nursery, Urban Balcony, Commercial Greens).
   - Milestone tracking and foreign-key linked care tasks.

5. **Care Timeline & Diagnostics Analytics**:
   - Historical logs of watering, misting, soil amendments, and vitality ratings.
   - Operational health metrics and scheduled maintenance forecasting.

6. **Progressive Web App (PWA)**:
   - Installable on iOS, Android, and Desktop with offline asset caching and service worker registration.

7. **Dual-Mode Persistence (Local + Supabase PostgreSQL)**:
   - Works immediately out-of-the-box with preloaded botanical seed data.
   - One-click seamless migration and live two-way synchronization to Supabase PostgreSQL when credentials are provided.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion (Framer Motion).
- **Backend / API**: Node.js, Express, `esbuild` server bundler, Vite 6 middleware.
- **AI Engine**: Google Gemini API (`@google/genai` SDK, `gemini-3.8-flash`).
- **Database**: Supabase PostgreSQL with relational schema (`/supabase/schema.sql`).
- **Build Tooling**: Vite 6, TypeScript (`tsc`), `esbuild`, `tsx`.

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ (Node.js 20 or 22 recommended)
- npm or bun

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/verdant-plant-care.git
cd verdant-plant-care
npm install
```

### 2. Configure Environment Variables
Copy the template and fill in any optional credentials:
```bash
cp .env.example .env
```

| Variable | Description | Default / Requirement |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for Flora AI & semantic search | Injected automatically in AI Studio; optional in local dev (fallback activates) |
| `PORT` | HTTP server listening port | Defaults to `3000` |
| `SUPABASE_URL` | Supabase project URL (`https://xyz.supabase.co`) | Optional (enables PostgreSQL synchronization) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role secret key | Server-side only; never expose in frontend |
| `SUPABASE_ANON_KEY` | Supabase public anonymous key | Optional client-level fallback |

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build Command
The build process compiles both the client SPA (via Vite) and bundles the production Express backend into a standalone CommonJS bundle (`dist/server.cjs`):
```bash
npm run build
```

### Start Command
Launches the compiled production server, serving pre-rendered static assets and secure API routes:
```bash
npm start
```

### Verification & Testing
Run the automated test suite and type checker:
```bash
npm test
npm run lint
```

---

## 🌐 Deployment Options

### 1. Google Cloud Run / Google AI Studio (Native)
Verdant is pre-configured for Google Cloud Run:
- The server automatically binds to `0.0.0.0:3000` or `process.env.PORT`.
- Gemini API keys and secrets are automatically managed via Cloud Secret Manager.
- Single command container build runs `npm run build && npm start`.

### 2. Docker Container Deployment
Create a standard `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t verdant-app .
docker run -p 3000:3000 -e GEMINI_API_KEY="your-key" verdant-app
```

### 3. Railway / Render / Fly.io
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- Set `NODE_ENV=production` and add `GEMINI_API_KEY` in environment settings.

---

## 🗄 Database Setup (Supabase PostgreSQL)

To enable persistent cloud database storage:
1. Create a free project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Add your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your environment variables.
5. In the Verdant app UI, open the **Database Cloud Sync** modal (or call `POST /api/supabase/migrate`) to seed and sync your records in one click.

---

## 🔒 Security & Privacy

- **Zero Client-Side Secrets**: All Gemini AI calls and database administrative operations execute strictly on the Express backend (`/server.ts`).
- **Input Sanitization & Parameter Validation**: REST endpoints sanitize queries, check data types, and restrict payload sizes.
- **Fail-Safe Offline Operation**: The app degrades gracefully to local storage and deterministic heuristic matching when external services are unavailable.

---

## 📄 License
MIT License. Created for botanical lovers and plant care curators.
