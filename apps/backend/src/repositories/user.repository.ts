import pool from '../db.js';
import { User } from '../models/user.model.js'; 

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *';
    const values = [email, passwordHash];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}