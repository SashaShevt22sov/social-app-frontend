export interface RegisterForm {
  username: string;
  displayName: string;
  email: string;
  password: string;
}
export interface LoginForm {
  email: string;
  password: string;
}
export interface User {
  id?: number | null;
  username: string;
  displayName: string;
  email: string;
  avatar?: string | null;
}
