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

  async createTask(userId: string, taskData: { title: string; energy_level?: string; estimated_time_minutes?: number }) {
  return this.taskRepository.create(userId, taskData);
}

  async updateTask(taskId: string, userId: string, updates: Partial<Task>) {
    return this.taskRepository.update(taskId, userId, updates);
  }

  async deleteTask(taskId: string, userId: string) {
    return this.taskRepository.delete(taskId, userId);
  }

    async getSuggestedTask(userId: string) {
    return this.taskRepository.findSuggested(userId);
 }
 // Add this method inside the TaskService class
async createManyTasks(userId: string, tasksData: any[]) {
  return this.taskRepository.createMany(userId, tasksData);
}
}