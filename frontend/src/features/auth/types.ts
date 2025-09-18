import type { BaseEntity } from '@/shared/types';

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  role?: string;
  city?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
  confirmPassword: string;
}
