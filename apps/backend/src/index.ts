// apps/backend/src/index.ts
import express from 'express';
import pool from './db.js';
import authRoutes from './routes/auth.routes.js'; // <-- IMPORT AUTH ROUTES
import taskRoutes from './routes/task.routes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
// This endpoint works
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the ADHD Vroom backend!' });
});

// ADD THIS NEW ENDPOINT FOR DATABASE TESTING
app.get('/api/db-test', async (req, res) => {
  try {
    // Get a client from the connection pool
    const client = await pool.connect();

    // Run a simple query to get the current time from the database
    const result = await client.query('SELECT NOW()');

    // Release the client back to the pool
    client.release();

    // Send the result back to the user
    res.json({
      success: true,
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to the database.',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);  

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});