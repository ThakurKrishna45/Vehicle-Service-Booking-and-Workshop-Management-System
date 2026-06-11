export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin';
}

export type UserRole = User['role'];

export type SessionUser = Omit<User, 'password'>;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDetails {
  name: string;
  email: string;
  phone: string;
  password: string;
}
