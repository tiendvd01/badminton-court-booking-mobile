export interface IUser {
  id?: number;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}
