// apps/backend/src/services/task.service.ts

import { TaskRepository } from '../repositories/task.repository.js';
import { Task } from '../models/task.model.js';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getTasksByUserId(userId: string) {
    return this.taskRepository.findByUserId(userId);
  }

  async createTask(userId: string, title: string) {
    return this.taskRepository.create(userId, title);
  }

  async updateTask(taskId: string, userId: string, updates: Partial<Task>) {
    return this.taskRepository.update(taskId, userId, updates);
  }

  async deleteTask(taskId: string, userId: string) {
    return this.taskRepository.delete(taskId, userId);
  }
}