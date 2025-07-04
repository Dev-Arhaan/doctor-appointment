import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import appointmentRoutes from './routes/appointments';
import prescriptionRoutes from './routes/prescriptions';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

import dataService from './services/dataService';
import { ApiResponse } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://your-frontend-domain.com'] 
//     : ['http://localhost:3000', 'http://localhost:19006', 'exp://127.0.0.1:19000', 'http://192.168.1.18:8081'], // Local development
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
// }));
app.use(cors())

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const healthData = await dataService.healthCheck();
    const extendedHealthData = {
      ...healthData,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
    const response: ApiResponse<typeof extendedHealthData> = {
      success: true,
      data: extendedHealthData,
      message: 'Server is healthy'
    };
    res.json(response);
  } catch (error) {
    logger.error('Health check failed', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Server health check failed'
    };
    res.status(500).json(response);
  }
});

// API routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Welcome route
app.get('/', (req, res) => {
  const response: ApiResponse<any> = {
    success: true,
    data: {
      message: 'Doctor Appointment API',
      version: '1.0.0',
      endpoints: {
        appointments: '/api/appointments',
        prescriptions: '/api/prescriptions',
        health: '/health'
      }
    },
    message: 'Welcome to Doctor Appointment API'
  };
  res.json(response);
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Doctor Appointment API is ready!`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API endpoints: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;