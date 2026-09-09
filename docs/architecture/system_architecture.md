# MELA System Architecture

## Architecture Diagram (Logical Topology)

```
+----------------------------------------------------------------+
|                   MELA Flutter Mobile Client                   |
| (lib/features: voice, camera, catalog, pricing, orders, etc.)   |
+-------------------------------+--------------------------------+
                                |
                                | REST API (JSON / HTTPS)
                                | Bearer JWT Auth
                                v
+----------------------------------------------------------------+
|                    FastAPI Backend Gateway                     |
|           (/api/v1/ - Routing, Middleware, Validation)         |
+---------------+----------------+---------------+---------------+
                |                |               |
                v                v               v
+------------------+   +-------------------+   +-----------------+
| Services Layer   |   |   AI Subsystems   |   | Payment Gateway |
| - Auth           |   | - Vision Enhance  |   | (Isolated       |
| - Products       |   | - Speech/Voice    |   |  Razorpay / UPI |
| - Orders/Buyers  |   | - Translation     |   |  Adapter)       |
| - Notifications  |   | - Smart Pricing   |   |                 |
+--------+---------+   +---------+---------+   +--------+--------+
         |                       |                      |
         +-----------------------+----------------------+
                                 |
                                 v
+----------------------------------------------------------------+
|               Data Persistence (PostgreSQL DB)                 |
|     (artisans, products, images, categories, orders, logs)    |
+----------------------------------------------------------------+
```

## Architectural Decoupling Principles
1. **Frontend Isolation**: Flutter connects strictly to FastAPI REST endpoints. Flutter has no direct database access.
2. **Controller/Service Separation**: FastAPI routes are lightweight routers that parse inputs, delegate to `app/services/`, and serialize outputs via Pydantic schemas.
3. **AI Pipeline Pluggability**: The AI layer (`app/ai/`) provides pluggable interfaces so cloud-based LLM APIs (Gemini) or local models (Whisper/PyTorch) can be substituted with zero disruption to the core business logic.
4. **Security & Secrets**: Secrets are consumed exclusively from the environment; JWT keys and DB credentials never enter the Git tree.
