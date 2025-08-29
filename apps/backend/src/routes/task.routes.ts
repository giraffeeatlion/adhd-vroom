// apps/backend/src/routes/task.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSuggestedTask,
  createManyTasks,
} from '../controllers/task.controller.js';

const router = Router();

// Apply the auth middleware to all task routes
router.use(authMiddleware);

// Define the routes
router.get('/suggested', getSuggestedTask);
router.post('/bulk', createManyTasks);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);


export default router;