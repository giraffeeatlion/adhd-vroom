// apps/backend/src/services/auth.service.ts

import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(email: string, password: string): Promise<Omit<User, 'password_hash'>> {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // 2. Hash the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Use the repository to create the new user
    const newUser = await this.userRepository.create(email, hashedPassword);

    // 4. Return the user data, but OMIT the password hash
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  async login(email: string, password: string): Promise<{ token: string }> {
    // 1. Find the user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    // 3. If credentials are valid, generate a JWT
    const token = jwt.sign(
      { userId: user.id }, // Payload: The data you want to store in the token
      process.env.JWT_SECRET!, // The secret key
      { expiresIn: '1h' } // Options: Token expires in 1 hour
    );

    return { token };
  }
}