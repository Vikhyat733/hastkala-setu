# mela | मेला (SIH Edition)
> **AI-Powered E-Commerce Marketplace & Gemini Vision Onboarding Studio for Rural Artisans**

---

## 📁 Project Structure

```
SIH MEEELAAAA/
├── frontend/             # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/   # UI components (Navbar, Hero, ProductModal, AIVisionStudio, etc.)
│   │   ├── context/      # React MarketplaceContext state management
│   │   ├── data/         # Authentic Indian handicrafts database & 8-language translations
│   │   ├── services/     # Gemini Vision AI service & Web Speech audio narrator
│   │   └── types/        # TypeScript interfaces
│   ├── index.html        # Main HTML with Google Fonts & metadata
│   ├── package.json      # Frontend dependencies
│   ├── tailwind.config.js# Terracotta, Saffron & Indigo craft theme
│   └── README.md
│
├── backend/              # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── controllers/  # AI Vision, Products, Artisans, Orders controllers
│   │   ├── routes/       # Express route handlers (/api/ai, /api/products, etc.)
│   │   ├── services/     # Gemini Vision API integration & Fair-price engine
│   │   ├── data/         # Mock database and seed crafts
│   │   └── server.ts     # Express server entry point
│   ├── package.json      # Backend dependencies
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
└── package.json          # Workspace root scripts
```

---

## 🚀 Quick Start Guide

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
Backend API will be live on **`http://localhost:5000`**.

---

## ✨ Key AI & Marketplace Features

1. **Gemini Vision AI Studio**:
   - Artisan snaps or uploads a photo of their handicraft (or selects demo crafts like Jaipur Blue Pottery, Madhubani Art, Bastar Dhokra, Channapatna Toys).
   - Gemini Vision AI automatically analyzes visual features and generates:
     - Catchy, culturally resonant **Product Titles**.
     - Accurate **Craft Category** and **GI (Geographical Indication) status**.
     - **Fair Price Recommendation** (calculating raw material cost + artisan labor hours @ living wage rate + safe logistics).
     - Evocative **Marketing Descriptions & Stories in 8 Indian Languages** (*English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada*).
     - **Voice Read-Aloud Audio Narration** for artisans with low digital literacy.
     - 1-Click **WhatsApp & Instagram Social Seller Kit**.
   - Instant 1-click **Live Publishing** to the marketplace.

2. **Rich E-Commerce Marketplace**:
   - Filter by craft category, GI certification, 100% eco-friendly status, and Indian states.
   - Comprehensive **Product Modal** with high-res zoom, "Meet the Maker" artisan card, and transparent price breakdown.
   - **Craft Basket Drawer** with direct artisan tipping and discount coupons (`HASTKALA2026`).
   - **Simulated Checkout** with interactive UPI QR code payment and printable digital invoice.

3. **Artisan Hub & Dashboard**:
   - Real-time seller metrics (Total Fair Earnings, Products Sold, Patron Tips).
   - **AI Festive Demand Advisor** providing predictive insights for upcoming festivals (Diwali, Wedding Season, Craft Melas).
