# Document Intelligence Platform

A Document Intelligence Platform POC built for Summarecon Mall, with Receipt Validation as the first use case.

Built with Next.js 16.2.10, TypeScript, and TailwindCSS v4 (App Router).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Four Processing Options

1. **OCR Only** -- Extract text from receipt images
2. **Standard OCR** -- Extract + validate receipt data
3. **OCR Knowledge** -- Extract + validate + fraud detection
4. **Full Platform** -- Extract + validate + fraud + analytics

## Architecture

- `src/lib/document/` -- Generic document intelligence platform layer
- `src/lib/receipt/` -- Receipt-specific use case logic
- `src/components/` -- React UI components
- `src/app/` -- Pages and API routes
- `docs/` -- Architecture and design documentation

## Documentation

| Document | Description |
|----------|-------------|
| `docs/ARCHITECTURE.md` | System architecture, layers, and immutability rules |
| `docs/PIPELINE.md` | Current receipt pipeline and target generic pipeline |
| `docs/PROVIDER_STRATEGY.md` | OCR provider abstraction and future providers |
| `docs/KNOWLEDGE_LAYER.md` | Entities, relationships, risk signals, audit evidence |
| `docs/RULE_ENGINE_DIRECTION.md` | Future externalized rule engine direction |
| `docs/DEMO_EXPERIENCE_FOUNDATION.md` | Demo experience blueprint and implementation plan |
| `docs/FOLDER_STRUCTURE.md` | Folder ownership and responsibility |
| `docs/EXECUTION_RULES.md` | Engineering report discipline and build/lint requirements |
| `docs/ROADMAP.md` | Implementation phases and future task order |
| `docs/DOCUMENT_INTELLIGENCE_ARCHITECTURE.md` | Document layer architecture deep-dive |

## Build

```bash
npm run build
npm run lint
```
