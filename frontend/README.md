# DocGen Frontend 💻

> A premium, modern Next.js client-side interface built with TypeScript and Tailwind CSS to monitor pipelines, browse repositories, and chat with your codebase.

---

## Technical Stack
* **Next.js 16 (App Router)** — React framework for routing and rendering.
* **TypeScript** — strict compile-time type-safety.
* **Tailwind CSS v4** — modern styling system.
* **Axios** — HTTP client for backend requests.
* **Lucide React** — clean developer-focused iconography.

---

## Key Features
* **Pipeline Dashboard**: Monitor indexed repository counts, ongoing scanner tasks, active webhooks, and read live logs streaming from background workers.
* **Codebase Explorer**: Browse indexed repositories, view folder documents, and download documentation as `.md` files.
* **DocGen Copilot Chat**: Interact with a GitHub Copilot-themed chat helper to search codebases, review architectures, or format questions with markdown.
* **Pull Request Docs**: Fetch pull requests directly from GitHub or manually input branches, files, and diff details to generate change-logs and migration guides.
* **API Documentation**: Embeds backend Swagger UI smoothly inside a responsive iframe.

---

## Directory Structure

```
frontend/
├── next.config.ts              # Next.js configs & API proxy rewrite rules
├── package.json                # NPM scripts and dependencies
├── tsconfig.json               # TypeScript configurations
├── .env.example                # Template for frontend environment variables
│
└── src/
    ├── app/                    # Next.js Page routes
    │   ├── layout.tsx          # Main HTML frame layout
    │   ├── globals.css         # Styling system (base cursors, GitHub button themes)
    │   ├── page.tsx            # Dashboard homepage with live worker logs
    │   ├── api-docs/           # Embedded Swagger API docs page
    │   ├── chat/               # DocGen Copilot chat assistant
    │   ├── pull-requests/      # PR details & changelog generator
    │   └── repositories/       # Folder & document explorer pages
    │
    ├── components/             # Reusable global layout items
    │   ├── Sidebar.tsx         # Left navigation bar (dashboard, chat, settings)
    │   └── ClientBody.tsx      # Main application structure shell
    │
    └── lib/                    # API connection services
        └── api.ts              # Axios wrapper targeting backend endpoints
```

---

## Local Setup

### Prerequisites
* Node.js 18+
* npm or yarn

### Installation
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
4. Configure `.env` file variables:
   * **`NEXT_PUBLIC_API_URL`**: Defaults to `http://localhost:8000` (FastAPI backend). If left empty, it will fall back to using Next.js proxy rewrites on the same host.

5. Start the frontend developer server:
   ```bash
   npm run dev
   ```

* Open your browser and navigate to `http://localhost:3000`.

---

## Production Build Verification
To check for syntax, linter, or TypeScript compile errors before deployment:
```bash
npm run build
```
This builds an optimized production bundle inside `.next/`.
