import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import routes from './routes/index.js';  // Your modular routes (make sure it exports all routes including authRoutes)

dotenv.config();

const app = express();

// CORS configuration: allow your frontend dev servers
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Add your frontend URLs here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS for preflight requests
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// HTTP request logger middleware
app.use(morgan('dev'));

// Parse incoming JSON requests
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to TaskHub API' });
});

// Mount your API routes under /api-v1
// Make sure in routes/index.js you import and combine all subroutes, e.g. authRoutes
app.use('/api-v1', routes);

// 404 handler: for any unmatched routes (should come after all route declarations)
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler middleware (should be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server after MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
    process.exit(1); // Exit process on DB connection failure
  });
