import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/apiResponse.js';

const app = express();

// --- Security & infrastruktur ---
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (!env.isProd) {
  app.use(morgan('dev'));
}

// --- Root ---
app.get('/', (_req, res) =>
  sendSuccess(res, {
    name: "Path'Ora API",
    version: 'v1',
    docs: '/api/v1/health',
  }),
);

// --- API v1 ---
app.use('/api/v1', apiRoutes);

// --- 404 & error handler (paling akhir) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
