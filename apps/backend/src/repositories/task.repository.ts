// apps/backend/src/repositories/task.repository.ts

import pool from '../db.js';
import { Task } from '../models/task.model.js';

export class TaskRepository {
  async findByUserId(userId: string): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  }

  async create(userId: string, title: string): Promise<Task> {
    const query = 'INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *';
    const values = [userId, title];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(taskId: string, userId: string, updates: Partial<Task>): Promise<Task | null> {
    // Dynamically build the SET part of the query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `"${field}" = $${index + 3}`).join(', ');

    if (fields.length === 0) {
      return null; // Or throw an error
    }

    const query = `UPDATE tasks SET ${setClause} WHERE id = $1 AND user_id = $2 RETURNING *`;
    const queryValues = [taskId, userId, ...values];

    const result = await pool.query(query, queryValues);
    return result.rows[0] || null;
  }

  async delete(taskId: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2';
    const values = [taskId, userId];
    const result = await pool.query(query, values);
    return !!result.rowCount;
  }
}