# MELA — AI-Powered Mobile Marketplace & Virtual Business Manager

> **Smart India Hackathon 2026**  
> **Problem Statement ID**: `SIH26090`  
> **Theme**: Empowering marginalized rural artisans through AI-driven commerce, accessible storytelling, fair pricing, and automated cataloging.

---

## 📌 Executive Summary

**MELA** is an end-to-end digital ecosystem designed specifically for marginalized rural artisans across India. Many traditional craftsmen and artisans face language barriers, lack access to fair market pricing, struggle with professional digital photography/catalog generation, and are exploited by intermediaries.

MELA provides:
1. **Artisan-Centric Mobile Application**: High-accessibility UI with vernacular voice navigation, single-tap photo capture, automated AI product enhancement, and intelligent pricing recommendations.
2. **Virtual Business Manager**: Autonomous assistance for order fulfillment, inventory management, B2B buyer inquiries, and fair earnings visibility.
3. **Robust Backend & Services**: High-performance FastAPI infrastructure ensuring clean service isolation, reliable REST APIs, role-based access control, and asynchronous AI task pipelines.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Mobile Frontend** | Flutter (Dart) | Single codebase for Android/iOS, native performance, rich custom design system, and multi-language/offline support. |
| **Backend API** | FastAPI (Python 3.11+) | Asynchronous high-throughput REST API, automatic OpenAPI documentation, strict type-safety with Pydantic. |
| **Database** | PostgreSQL + SQLAlchemy / Alembic | Robust relational schema for artisans, crafts, orders, transactions, and audit logs. |
| **AI Subsystems** | Modular Python AI Services (Gemini Vision / Whisper / Scikit-learn / PyTorch) | Decoupled image enhancement, speech-to-text, vernacular translation, and pricing intelligence. |
| **Deployment** | Docker, Nginx, Cloud-Ready Compose | Containerized microservice architecture for deterministic local setup and scalable cloud deployment. |

---

## 📂 Repository Architecture

```text
MELA/
├── frontend/
│   └── mela_app/               # Flutter mobile application
│       ├── lib/
│       │   ├── core/           # Universal constants, theme, routing, network client, storage
│       │   ├── features/       # 17 independent modular feature domains
│       │   └── main.dart       # App initialization and entry point
│       └── pubspec.yaml        # Flutter dependencies & assets configuration
├── backend/
│   └── mela_api/               # FastAPI backend
│       ├── app/
│       │   ├── main.py         # FastAPI application entry point
│       │   ├── core/           # App config, database session, security/auth core
│       │   ├── models/         # SQLAlchemy database models
│       │   ├── schemas/        # Pydantic validation & response schemas
│       │   ├── api/routes/     # Clean, versioned (/api/v1/) API routes
│       │   ├── services/       # Core business logic (auth, orders, products, etc.)
│       │   └── ai/             # AI adapter pipelines (enhancement, speech, pricing)
│       ├── tests/              # Automated test suite
│       └── requirements.txt    # Python dependencies
├── ai/                         # Machine learning artifacts & experiments
│   ├── image_models/           # Vision models & enhancement weights
│   ├── pricing_model/          # Fair-pricing ML estimators
│   ├── datasets/               # Artisan craft training datasets
│   └── experiments/            # Model training & evaluation notebooks
├── database/                   # Relational persistence management
│   ├── migrations/             # Database migration scripts
│   ├── schema/                 # DDL initial schema definitions
│   └── seed/                   # Demonstration & developmental seed data
├── docs/                       # Project documentation
│   ├── architecture/           # System topology & diagrams
│   ├── api/                    # API specifications & contracts
│   ├── ui/                     # UI/UX design specifications & flows
│   └── sih/                    # SIH 2026 problem statement details
├── deployment/                 # Infrastructure & deployment manifests
│   ├── docker/                 # Container Dockerfiles
│   ├── nginx/                  # Reverse proxy configurations
│   └── cloud/                  # Cloud deployment orchestration
├── .env.example                # Canonical environment configuration template
├── .gitignore                  # Git ignore rules for Python, Flutter, Docker, AI weights
├── docker-compose.yml          # Multi-container orchestration (DB + API)
└── README.md                   # Project overview and documentation
```

---

## 🔄 Frontend & Backend Communication Contract

1. **Protocol**: HTTP/REST over TLS using standardized JSON payloads.
2. **Base URL**: All endpoints are strictly prefixed under `/api/v1/`.
3. **Authentication**: Stateless JWT Bearer tokens passed in the `Authorization: Bearer <token>` header.
4. **Decoupled Architecture**: 
   - Flutter **NEVER** communicates directly with PostgreSQL or any persistence layer.
   - Flutter interacts exclusively via the typed `ApiClient` with FastAPI endpoints.
   - Heavy AI workloads (such as image upscaling or voice synthesis) are processed asynchronously on the backend or specialized worker nodes.

---

## 📜 Architectural & Development Rules

1. **Strict Decoupling**: Flutter communicates with FastAPI exclusively via REST APIs. Direct database access from frontend is forbidden.
2. **Service Layer Isolation**: API route handlers must remain thin controllers. All validation, orchestration, and business logic belong in `app/services/`.
3. **Data Segregation**: SQLAlchemy database models (`app/models/`) must remain distinct from Pydantic API schemas (`app/schemas/`).
4. **Modular AI Pipeline**: AI operations (`app/ai/`) are isolated behind clean service interfaces to permit independent model swapping without affecting business logic.
5. **Payment Isolation**: Payment workflows (`app/services/payments/`) are strictly isolated to guarantee security and compliance.
6. **No Hardcoded Secrets**: All credentials, database URLs, and API keys must be loaded via environment variables (`.env`).
7. **Component Reusability**: Frontend UI must utilize core reusable widgets (`lib/core/widgets/`) rather than inline duplicated UI code.
8. **Incremental Delivery**: Do not implement unverified dummy features or monolithic files; every component must be purposeful and adhere to the architectural boundary.

---

## 🚀 Getting Started

### 1. Backend (FastAPI)
```bash
# Navigate to backend directory
cd backend/mela_api

# Create & activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Health Check: `http://localhost:8000/api/v1/health`
- Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend (Flutter)
```bash
# Navigate to frontend directory
cd frontend/mela_app

# Fetch Flutter dependencies
flutter pub get

# Run on connected device or emulator (or Chrome for web)
flutter run
```
