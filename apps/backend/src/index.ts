// apps/backend/src/index.ts

import express from 'express';
import cors from 'cors'; // <-- 1. IMPORT CORS
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); // <-- 2. USE THE CORS MIDDLEWARE

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});