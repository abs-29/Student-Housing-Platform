import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.mjs';
import propertyRoutes from './routes/propertyRoutes.mjs';
import bookingRoutes from './routes/bookingRoutes.mjs';
import reviewRoutes from './routes/reviewRoutes.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
global.dbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-housing', {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    global.dbConnected = true;
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    global.dbConnected = false;
    console.warn('⚠️  MongoDB Connection Warning:', error.message);
    console.warn('💡 Tip: Start MongoDB with: mongod');
    console.warn('💡 Or use MongoDB Atlas: Set MONGODB_URI in .env');
    console.warn('📝 Server running without database - Frontend will work, but APIs may fail');
    
    // Retry connection after 10 seconds
    setTimeout(connectDB, 10000);
  }
};

connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/properties', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'properties.html'));
});

app.get('/add-property', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'add-property.html'));
});

app.get('/property-details', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'property-details.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
  console.log('🌐 Frontend: http://localhost:' + PORT);
  console.log('🔌 API: http://localhost:' + PORT + '/api');
});

export default app;