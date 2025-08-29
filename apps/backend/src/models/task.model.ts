// apps/backend/src/models/task.model.ts

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  energy_level: string | null;
  context: string | null;
  due_date: Date | null;
  completed_at: Date | null;
  estimated_time_minutes: number | null;
  created_at: Date;
}