# 🪔 HastKala Setu — Local Setup & Execution Guide

> **AI-Powered Local Artisan E-Commerce Marketplace (SIH Mela Edition)**  
> **Repository:** [https://github.com/Vikhyat733/hastkala-setu](https://github.com/Vikhyat733/hastkala-setu)

This document provides step-by-step instructions for teammates to download and run the project locally on their computer using **VS Code** or **Antigravity IDE**.

---

## 📋 Prerequisites

Before starting, make sure you have the following installed:

1. **Node.js (v18 or newer)**: [Download Node.js](https://nodejs.org/) (LTS recommended)
   - Verify by running: `node -v` and `npm -v` in your terminal.
2. **Git**: [Download Git](https://git-scm.com/)

---

## 📥 Step 1: Clone or Download the Repository

### Option A: Using Git (Recommended)
Open your terminal (PowerShell, Command Prompt, or Bash) and run:

```bash
# Clone the repository
git clone https://github.com/Vikhyat733/hastkala-setu.git

# Navigate into the project folder
cd hastkala-setu
```

### Option B: Download ZIP from GitHub
1. Visit [https://github.com/Vikhyat733/hastkala-setu](https://github.com/Vikhyat733/hastkala-setu).
2. Click the green **`<> Code`** button and select **`Download ZIP`**.
3. Extract the ZIP file to your Desktop.
4. Rename the extracted folder to `hastkala-setu`.

---

## 💻 Step 2: Open in VS Code or Antigravity IDE

1. Open **VS Code** or **Antigravity IDE**.
2. Click **File** ➔ **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Select the `hastkala-setu` folder.
4. Open the integrated terminal by pressing **`Ctrl + \``** (or via **Terminal ➔ New Terminal**).

---

## 🎨 Step 3: Run the Frontend (Client Web App)

In your terminal, execute:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

> 🌐 **Frontend URL:** [http://localhost:3000](http://localhost:3000)  
> Open this link in Google Chrome or your default browser.

---

## ⚙️ Step 4: Run the Backend (API Server)

Open a **second terminal tab** in VS Code / Antigravity (click the **`+`** icon in the terminal panel):

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start backend server
npm run dev
```

> 🚀 **Backend API URL:** [http://localhost:5000](http://localhost:5000)  
> 🩺 **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚡ Quick Two-Terminal Overview

| Service | Terminal Commands | Port / URL |
|---|---|---|
| **Frontend (React)** | `cd frontend` <br> `npm install` <br> `npm run dev` | `http://localhost:3000` |
| **Backend (Express)** | `cd backend` <br> `npm install` <br> `npm run dev` | `http://localhost:5000` |

---

## 🔑 Step 5: (Optional) Configure Gemini Vision API Key

- **Backend**: In `backend/`, copy `.env.example` to `.env` and set `GEMINI_API_KEY=your_key`.
- **Frontend**: Click the **"Custom Gemini Key"** button in the top bar of the **AI Vision Studio** inside the web app to save it in local storage.
- *Note:* Even without an API key, the app includes intelligent built-in craft neural models and demo handicraft presets (*Jaipur Blue Pottery, Madhubani Art, Bastar Dhokra, Channapatna Toys*) that work 100% out of the box!

---

## 📁 Repository Structure

```
hastkala-setu/
├── 📂 frontend/                  # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/          # AIVisionStudio, Navbar, Hero, Modals, Cart, etc.
│   │   ├── context/             # Marketplace state management & local storage
│   │   ├── data/                # Sample GI crafts & 8-language translations
│   │   ├── services/            # Gemini Vision API client & audio narration
│   │   └── types/               # TypeScript models
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts
│   └── README.md
│
├── 📂 backend/                   # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/         # AI, Products, Orders, and Artisans handlers
│   │   ├── routes/              # Express API endpoints
│   │   ├── services/            # Gemini integration & Fair-Price calculator
│   │   └── server.ts            # Server entry point
│   ├── package.json             # Backend dependencies
│   ├── .env.example
│   └── README.md
│
├── HOW_TO_START.txt             # Plain text setup guide
├── HOW_TO_START.md              # Markdown setup guide
├── README.md                    # Project overview
└── package.json                 # Unified workspace root
```

---

## 🛠️ Troubleshooting

- **Port 3000 or 5000 is already in use:**
  - Close any existing Node processes or run `npm run dev -- --port 3001` in frontend.
- **Node module errors:**
  - Delete `node_modules` and run `npm install` again.
- **TypeScript or build issues:**
  - Run `npm run build` in either `frontend/` or `backend/` to check for compilation errors.
