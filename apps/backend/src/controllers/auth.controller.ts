// apps/backend/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const newUser = await authService.register(email, password);
    res.status(201).json(newUser);

  } catch (error: any) {
    // Check for the specific "user already exists" error
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    
    // For all other errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message }); // 401 Unauthorized
  }
};