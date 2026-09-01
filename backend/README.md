# HastKala Setu - Backend API Service

AI-Powered Artisan Marketplace Backend Service with Google Gemini Vision Multimodal Integration, Fair-Trade Pricing Engine, and Multilingual Cultural Storytelling.

## Tech Stack
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Multimodal AI**: Google Gemini 1.5 / 2.0 Flash Vision API
- **File Uploads**: Multer (in-memory buffer)
- **Execution / Tooling**: TSX / TSC

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Run Dev Server
```bash
npm run dev
```
Server starts on `http://localhost:5000`

### 4. Build for Production
```bash
npm run build
npm start
```

---

## API Endpoints Reference

### AI Vision & Multilingual Processing (`/api/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/analyze-craft` | Upload craft photo (`multipart/form-data` or `imageBase64`). Analyzes visual features with Gemini Vision and generates titles, GI status, price calculation, and descriptions in 8 Indian languages. |
| `POST` | `/api/ai/pricing-estimate` | Computes fair artisan wages based on labor hours and materials. |

### Products Catalog (`/api/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Filter crafts by `category`, `state`, `giOnly`, `ecoOnly`, `search`, and `sort`. |
| `GET` | `/api/products/:id` | Fetch specific craft details with artisan bio. |
| `POST` | `/api/products` | Publish new craft listing from AI Vision Studio. |
| `PUT` | `/api/products/:id` | Update product details / inventory. |
| `DELETE` | `/api/products/:id` | Delete product listing. |

### Artisans & Mela Analytics (`/api/artisans`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/artisans` | List verified master artisan profiles. |
| `GET` | `/api/artisans/:id/analytics` | Returns total earnings, dispatches, and AI festive demand insights. |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create an order with simulated UPI escrow. |
| `GET` | `/api/orders/:id` | Fetch order receipt and delivery tracking. |

### Health Check (`/api/health`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service uptime and Gemini key configuration status. |
