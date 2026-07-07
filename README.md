# Document Intelligence Platform

**Transforming unstructured business documents into trusted operational intelligence.**

---

## Executive Summary

The Document Intelligence Platform converts unstructured business documents — receipts, invoices, purchase orders, identity documents, and more — into structured, validated, and auditable data. It is not an OCR tool. It is an enterprise intelligence platform that applies progressive capability layers: text extraction, validation, fraud detection, and organizational analytics.

The first Proof of Concept (PoC) is deployed for retail receipt processing at Summarecon Mall, Indonesia. The architecture is document-type-agnostic. Every future document type — from tax invoices to passports — reuses the same pipeline, providers, and capability model without architectural changes.

---

## Background

Modern enterprises process hundreds of document types daily:

- Retail receipts and invoices
- Tax invoices (Faktur Pajak) and NPWP
- Purchase orders and delivery orders
- Identity documents (KTP, passport)
- Bank statements and insurance documents
- Contracts and legal documents

Most organizations handle these documents through one of three approaches:

| Approach | Outcome |
|----------|---------|
| Manual data entry | Slow, error-prone, unscalable |
| OCR-only automation | Text without context — no validation, no compliance, no trust |
| Custom-built per document type | Fragmented systems, duplicated investment, inconsistent output |

The Document Intelligence Platform replaces all three with a single, layered architecture that scales across document types and capability requirements.

---

## Why Traditional OCR Is Not Enough

Optical Character Recognition converts images into text. That is a necessary foundation, but it is not enterprise intelligence.

Enterprise document processing requires:

| Requirement | What OCR Alone Provides | What the Platform Adds |
|-------------|------------------------|------------------------|
| **Extraction** | Raw text with line breaks | Structured fields: merchant, date, total, items |
| **Validation** | Nothing | Business rules: tax calculation, format checks, cross-field consistency |
| **Ground Truth** | Nothing | Comparison against known correct data for accuracy measurement |
| **Fraud Detection** | Nothing | Pattern analysis: duplicate detection, unregistered merchants, suspicious transactions |
| **Knowledge** | Nothing | Entity extraction, relationship mapping, cross-document queries |
| **Analytics** | Nothing | Aggregated metrics, trends, business intelligence |

The platform does not stop at "what does the document say." It answers: **"Is it correct? Can it be trusted? What is the organization learning?"**

---

## Platform Philosophy

**Document Intelligence** is distinct from **Document Digitization**.

- Digitization converts paper to pixels or text. It is a utility.
- Intelligence extracts meaning, evaluates correctness, detects risk, and generates insight. It is a capability.

The platform is built on a single principle: **layered capability evolution**. One pipeline. One codebase. Four progressively intelligent processing options. Every option inherits and extends the previous.

This philosophy means:

- A document processed at Option 4 produces the same OCR output, the same validation, and the same fraud result as Options 1–3 — plus additional intelligence layers.
- Upgrading from Option 1 to Option 4 requires zero migration. The data and architecture are identical; only the feature gates change.
- The platform is a single product, not four separate products.

---

## Capability Evolution

The platform defines four capability levels. Each level inherits all capabilities from the previous level.

| Level | Theme | Business Question Answered |
|-------|-------|---------------------------|
| **Option 1 — OCR Engine** | Document Understanding | What does the document say? |
| **Option 2 — OCR + Validation Engine** | Document Correctness | Is the document correct? |
| **Option 3 — OCR + Fraud Detection** | Document Trust | Can the document be trusted? |
| **Option 4 — AI Document Intelligence Platform** | Organizational Intelligence | What is the organization learning? |

```
Option 1
  └─ Option 2 (everything from Option 1 + Ground Truth + Validation)
       └─ Option 3 (everything from Option 2 + Similarity + Fraud Detection)
            └─ Option 4 (everything from Option 3 + Knowledge + Analytics)
```

See [`docs/CAPABILITY_EVOLUTION.md`](docs/CAPABILITY_EVOLUTION.md) for the full narrative, business value per tier, and future evolution concepts.

---

## Pipeline Overview

All four options share the same universal pipeline. The only difference is how many stages execute.

```
Document Upload
    → Ingestion (validate file type, size, format)
    → OCR (text extraction via registered provider)
    → Normalization (clean whitespace, artifacts, separators)
    → Canonicalization (build stable document envelope)
    → Confidence Scoring (per-field and overall)
    → Ground Truth Benchmark (compare against known data) [Option 2+]
    → Validation (business rules, format checks) [Option 2+]
    → Similarity (duplicate and fuzzy match) [Option 3+]
    → Fraud Detection (risk pattern analysis) [Option 3+]
    → Knowledge Extraction (entities, relationships) [Option 4]
    → Analytics (aggregated metrics, trends) [Option 4]
    → API Response (structured JSON with pipeline trace)
```

Each stage records its status, duration, and a human-readable message in the pipeline trace. Every response includes exactly which stages ran and which were skipped.

See [`docs/PIPELINE_CONTRACT.md`](docs/PIPELINE_CONTRACT.md) for the complete stage definitions, output contracts, provider contract, and architecture boundaries.

See [`docs/PIPELINE.md`](docs/PIPELINE.md) for the current implementation details.

---

## Current Proof of Concept

**The PoC uses retail receipts from Summarecon Mall, Indonesia as the first business scenario.**

This is a deliberate choice: receipts are high-volume, contain structured and unstructured data, and require all four capability levels — extraction, validation, fraud detection, and analytics. They validate the architecture under realistic conditions.

**Receipt is the first document type, not the last.** The architecture treats the document type as a plugin. Adding a new type — invoice, KTP, passport — requires writing only a parser. The pipeline, providers, and capability model remain unchanged.

### What Is Implemented

- Receipt dataset with ground truth data (`public/receipts/`)
- Receipt gallery, preview, and selection UI
- OCR via Demo (mock) and Tesseract.js (real) providers
- Receipt parsing (items, totals, store, tax, payment method)
- Business rule validation (tax calculation, merchant registration, format checks)
- Fraud detection (unregistered merchants, suspicious hours, excessive discounts)
- Ground truth comparison (field-level accuracy metrics)
- Analytics dashboard (volume, confidence, top stores, daily trends)
- AI-powered business insights (transaction value, fraud risk, purchasing patterns)
- OCR provider toggle via Enterprise Preference Framework
- Demo session engine (full processing lifecycle management)
- Enterprise Preference Framework (12-file system with cookie/localStorage persistence, migration, schemas)
- Pipeline trace with per-stage timing and status

### What Is Planned but Not Yet Implemented

| Feature | Target Task |
|---------|-------------|
| Similarity engine (duplicate detection) | TASK-007A |
| Externalized rule engine (business-user-defined rules) | TASK-008 |
| Knowledge graph integration (entity extraction, cross-document queries) | TASK-009 |
| Pipeline visualization (animated trace component) | TASK-005C |

### Future Document Types (Architecture Ready, Parser Needed)

Invoices, tax invoices, purchase orders, delivery orders, KTP, NPWP, passports, bank statements, insurance documents, contracts, medical records.

---

## Technology Stack

### Current Implementation

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.10 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 |
| OCR (current) | Tesseract.js v7, Demo mock provider |
| State Management | React useReducer (Demo Session Engine) |
| Preference System | Enterprise Preference Framework (12 files, cookie + localStorage persistence) |
| Pipeline | Modular pipeline orchestrator with per-stage timing |
| Validation | Receipt-specific business rules (tax, format, arithmetic) |
| Fraud Detection | Pattern-based (merchant, transaction, payment analysis) |
| Analytics | Aggregated metrics from processing data |
| Dataset | File-based dataset repository with JSON ground truth |

### OCR Provider Architecture

Providers implement a single `OcrProvider` interface and are swappable without affecting any other pipeline stage:

| Provider | Status | Type |
|----------|--------|------|
| Demo Provider | ✅ Implemented | Mock data for demos and testing |
| Tesseract.js | ✅ Implemented | Pure JavaScript, zero native deps |
| Azure Document Intelligence | 🔲 Planned | Cloud API |
| Google Vision API | 🔲 Planned | Cloud API |
| AWS Textract | 🔲 Planned | Cloud API |
| OpenAI Vision (GPT-4o) | 🔲 Planned | Cloud API |
| PaddleOCR | 🔲 Planned | Self-hosted |
| Surya OCR | 🔲 Planned | Self-hosted |

See [`docs/PROVIDER_STRATEGY.md`](docs/PROVIDER_STRATEGY.md) for provider abstraction details.

---

## Repository Structure

```
src/
├── lib/
│   ├── document/          Generic document intelligence platform (pipeline, providers, types)
│   ├── receipt/           Receipt-specific logic (parsing, validation, fraud, confidence)
│   └── preferences/       Enterprise Preference Framework (storage, migration, schemas)
├── components/            React UI components (gallery, results, dashboard)
├── app/
│   ├── page.tsx           Landing page with four option cards
│   ├── process/           Main processing page with OCR provider toggle
│   └── api/               API routes (process-receipt, ground-truth)
├── hooks/                 React hooks (useDemoSession, usePreference)
docs/                      Architecture and design documentation
public/
├── receipts/              Sample receipt images with ground truth data
└── screenshot/            Screenshot evidence for engineering reports
```

Key architectural boundaries:

- `src/lib/document/` — Generic, document-type-independent platform layer
- `src/lib/receipt/` — Receipt-specific implementation (first use case)
- Adding a new document type (e.g., `src/lib/invoice/`) does not require changes to `src/lib/document/`

---

## Documentation Index

| Document | Description |
|----------|-------------|
| `README.md` | This file — product whitepaper and quick-start guide |
| `docs/PIPELINE.md` | Current receipt pipeline implementation and target generic pipeline |
| `docs/PIPELINE_CONTRACT.md` | Official capability contract — what each option executes and outputs |
| `docs/CAPABILITY_EVOLUTION.md` | Business and technical rationale for the four capability levels |
| `docs/ARCHITECTURE.md` | System architecture, layers, and immutability rules |
| `docs/PROVIDER_STRATEGY.md` | OCR provider abstraction and integration strategy for future providers |
| `docs/KNOWLEDGE_LAYER.md` | Entities, relationships, risk signals, and audit evidence model |
| `docs/RULE_ENGINE_DIRECTION.md` | Future externalized rule engine architecture |
| `docs/DEMO_EXPERIENCE_FOUNDATION.md` | Demo experience blueprint and implementation plan |
| `docs/FOLDER_STRUCTURE.md` | Folder ownership and responsibility definitions |
| `docs/EXECUTION_RULES.md` | Engineering report discipline and build/lint requirements |
| `docs/ROADMAP.md` | Implementation phases and future task order |
| `docs/DOCUMENT_INTELLIGENCE_ARCHITECTURE.md` | Document layer architecture deep-dive |
| `docs/PREFERENCE_FRAMEWORK.md` | Enterprise Preference Framework design |

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run lint
```

### Configure OCR Provider

The default OCR provider is Demo (mock data). To use real OCR with Tesseract.js, select "Tesseract.js" from the provider dropdown on the processing page. The selection persists across sessions via the Enterprise Preference Framework.

### Process a Sample Receipt

1. Open the processing page (`/process`)
2. Select a sample receipt from the gallery (Food Court, Electronics, Fashion, etc.)
3. Optionally change the processing option (1–4)
4. Click **Execute**
5. View OCR results, validation, fraud analysis, and ground truth comparison

---

## Roadmap

| Phase | Task | Status |
|-------|------|--------|
| **Phase I** — Demo Experience | TASK-005 (A–D) | A ✅ B ✅ C ⬜ D ⬜ |
| Real OCR Provider | TASK-006 (Tesseract.js) | ✅ |
| Pipeline Contract | TASK-007 (Capability Definition) | ✅ |
| Capability Evolution Doc | TASK-007B | ✅ |
| README Whitepaper | TASK-README-001 | ✅ |
| Similarity Engine | TASK-007A | ⬜ Pending |
| Rule Engine | TASK-008 | ⬜ Pending |
| Knowledge Builder | TASK-009 | ⬜ Pending |
| Vercel Deployment | TASK-010 | ⬜ Pending |
| Client Demo Script | TASK-011 | ⬜ Pending |
| Production Planning | TASK-012 | ⬜ Pending |

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for detailed descriptions.

---

## Future Vision

The following are directional goals. They are **not implemented** and **not planned** in the current roadmap.

| Vision | Description |
|--------|-------------|
| **Multi-document platform** | Process any document type — receipt, invoice, purchase order, identity card, contract — through the same pipeline with type-specific parsers. |
| **Enterprise Knowledge Graph** | Cross-document entity and relationship graph. Query across all processed documents ("find all transactions with PT Maju Jaya in the last quarter"). |
| **AI Audit Assistant** | Automated audit trail generation. Every document decision (approved, flagged, rejected) includes evidence, confidence, and risk score. |
| **Predictive Intelligence (Option 5)** | Predict payment delays, fraud likelihood, and compliance risk using historical data. |
| **Agentic Decision Support (Option 6)** | Autonomous agents that act on document insights: auto-approve low-risk invoices, initiate payment workflows, escalate anomalies. |
| **Cross-Enterprise Knowledge Graph (Option 7)** | Federated knowledge across tenants — detect supplier fraud across enterprises, benchmark processing across industry verticals. |

These visions are directional. They serve to validate that the architecture (one pipeline, layered capability, pluggable doc types) does not need to be redesigned to reach them.

---

## License

MIT (if applicable — confirm with project owner).

---

*Document Intelligence Platform — one pipeline, four capability levels, unlimited document types.*
