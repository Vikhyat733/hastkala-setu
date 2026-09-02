import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import productRoutes from './routes/productRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'mela Backend API',
    version: '1.0.0',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🎪 mela Backend Server listening on http://localhost:${PORT}`);
  console.log(`✨ AI Vision & Pricing APIs ready at http://localhost:${PORT}/api/ai`);
});
