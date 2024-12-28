export interface Create {
  firstname: string;
  lastname: string;
  telephone: number;
  email: string;
  role_id?: number;
  password: string;
  confirmPassword?: string;
}
export interface Update {
  firstname?: string;
  lastname?: string;
  telephone?: number;
  email?: string;
  role_id?: number;
  password?: string;
  confirmPassword?: string;
}
export interface UserData {
  firstName: string;
  lastName: string;
  role: string;
  userId?: string; 
}