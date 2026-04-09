# Explain This Website

Paste any URL and get an instant analysis report covering tech stack detection, SEO audit, conversion/UX observations, weak points, and actionable recommendations.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend  | Go (stdlib net/http), x/net/html |
| API      | REST — `POST /api/analyze`  |

---

## Prerequisites

- **Go 1.22+** — installed at `/usr/local/go` on macOS (add to PATH: `export PATH=$PATH:/usr/local/go/bin`)
- **Node 18+** and **npm**

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env        # edit if needed
/usr/local/go/bin/go mod download
/usr/local/go/bin/go run main.go
# Server listening on :8080
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_URL=http://localhost:8080
npm install
npm run dev
# App available at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173), paste a URL, and click **Analyze**.

---

## Development without a backend (mock mode)

Set `VITE_USE_MOCK=true` in `frontend/.env`. The app will return mock data after a short delay — no Go server required.

---

## Project Structure

```
.
├── backend/
│   ├── main.go
│   ├── go.mod
│   └── internal/
│       ├── config/       # env loading
│       ├── fetcher/      # HTTP client + SSRF guard
│       ├── handler/      # POST /api/analyze
│       ├── model/        # shared types
│       ├── parser/       # tech, SEO, UX, recommendations
│       └── server/       # ServeMux + CORS middleware
└── frontend/
    └── src/
        ├── components/   # UI: cards, primitives, layout
        ├── hooks/        # useAnalysis state machine
        ├── mock/         # mockData.ts for offline dev
        ├── services/     # analyzeApi.ts fetch wrapper
        └── types/        # TypeScript type definitions
```

---

## API Reference

### `POST /api/analyze`

**Request**
```json
{ "url": "https://example.com" }
```

**Success (200)**
```json
{
  "url": "https://example.com",
  "fetchedAt": "2026-04-09T14:32:00Z",
  "overview": { "title": "...", "description": "...", "language": "en", "pageLoadHint": "medium" },
  "techStack": [{ "name": "WordPress", "category": "cms", "confidence": "high" }],
  "seoChecks": [{ "id": "title", "label": "Page Title", "status": "pass", "detail": "..." }],
  "ux": { "hasCTA": true, "ctaCount": 3, "hasForms": false, "hasSocialProof": false, "hasTrustSignals": true, "hasContactInfo": false, "mobileReady": true },
  "weakPoints": ["No canonical URL — risk of duplicate content penalties"],
  "recommendations": ["Add <link rel=\"canonical\"> in the <head>"]
}
```

**Error (400 / 422 / 500)**
```json
{ "error": "invalid URL: must use http or https scheme" }
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable           | Default                      | Description                      |
|--------------------|------------------------------|----------------------------------|
| `PORT`             | `8080`                       | Port the API server listens on   |
| `ALLOWED_ORIGIN`   | `http://localhost:5173`      | CORS allowed origin              |
| `FETCH_TIMEOUT_SEC`| `10`                         | Seconds before aborting a fetch  |
| `MAX_BODY_BYTES`   | `5242880` (5 MB)             | Max response body size           |

### Frontend (`frontend/.env`)

| Variable        | Default                    | Description                             |
|-----------------|----------------------------|-----------------------------------------|
| `VITE_API_URL`  | `http://localhost:8080`    | Backend API base URL                    |
| `VITE_USE_MOCK` | `false`                    | Use mock data instead of real backend   |

---

## Building for Production

### Backend
```bash
cd backend
/usr/local/go/bin/go build -o explain-website main.go
./explain-website
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## Extending the Project

The codebase is structured to make these additions straightforward:

- **AI summaries** — call an LLM API in `parser/parser.go` after the existing analysis
- **Screenshot analysis** — add a `screenshotter` package alongside `fetcher`
- **Multi-page crawling** — extend `fetcher` to follow internal links
- **Saved reports** — add a `storage` package and a database layer; the `AnalysisResult` model is already serialisation-ready
- **Authentication** — add middleware in `server/server.go`
