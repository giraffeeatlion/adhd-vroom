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

  async create(userId: string, taskData: { title: string; energy_level?: string; estimated_time_minutes?: number }): Promise<Task> {
  const { title, energy_level, estimated_time_minutes } = taskData;
  // The status will now default to 'todo' in the database
  const query = `
    INSERT INTO tasks (user_id, title, energy_level, estimated_time_minutes) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const values = [userId, title, energy_level || null, estimated_time_minutes || null];
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
  async findSuggested(userId: string): Promise<Task | null> {
  const query = `
    SELECT * FROM tasks 
    WHERE user_id = $1 AND status = 'todo' 
    ORDER BY created_at ASC 
    LIMIT 1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
}
// Add this method to your TaskRepository class
async createMany(userId: string, tasks: Array<{ title: string; energy_level?: string; due_date?: string | null }>): Promise<Task[]> {
    if (tasks.length === 0) {
        return [];
    }

    let paramIndex = 1;
    const allValues: (string | null)[] = [];

    // Note: We only include the columns we are providing. 'status' will use its database default ('todo').
    const columns = ['user_id', 'title', 'energy_level', 'due_date'];

    const valueStrings = tasks.map(task => {
        const values = [
            userId,
            task.title,
            task.energy_level || 'low',
            task.due_date || null
        ];
        allValues.push(...values);
        const placeholders = values.map(() => `$${paramIndex++}`).join(', ');
        return `(${placeholders})`;
    }).join(', ');

    const query = `INSERT INTO tasks (${columns.join(', ')}) VALUES ${valueStrings} RETURNING *`;

    const result = await pool.query(query, allValues);
    return result.rows;
}
}