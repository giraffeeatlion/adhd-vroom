// apps/backend/src/routes/auth.routes.ts

import { Router } from 'express';
import { register,login } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login); 

router.get('/me', authMiddleware, (req, res) => {
  // Because the middleware ran, we now have access to req.user
  res.json({ message: 'This is a protected route!', user: (req as any).user });
});

export default router;