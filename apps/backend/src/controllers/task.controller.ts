// apps/backend/src/controllers/task.controller.ts

import { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';

const taskService = new TaskService();

// Custom interface to include the user property from our middleware
interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId; // Get user ID from the authenticated user
    const tasks = await taskService.getTasksByUserId(userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { title } = req.body;
    const newTask = await taskService.createTask(userId, title);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { taskId } = req.params;
    const updates = req.body;
    const updatedTask = await taskService.updateTask(taskId, userId, updates);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or permission denied' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { taskId } = req.params;
    const success = await taskService.deleteTask(taskId, userId);
    if (!success) {
      return res.status(404).json({ message: 'Task not found or permission denied' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const getSuggestedTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const task = await taskService.getSuggestedTask(userId);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggested task' });
  }
};

export const createManyTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const tasks = req.body;
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Request body must be an array.' });
    }
    const newTasks = await taskService.createManyTasks(userId, tasks);
    res.status(201).json(newTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tasks' });
  }
};