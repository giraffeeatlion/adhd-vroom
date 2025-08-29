
export interface User {
  id: string;
  email: string;
  password_hash: string;
  xp_points: number;
  current_streak: number;
  created_at: Date;
}