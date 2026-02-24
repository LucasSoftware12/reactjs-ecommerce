export interface User {
  id: number;
  email: string;
  roles?: { id: number; role: string }[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface Product {
  id: number;
  categoryId: number;
  title?: string;
  code?: string;
  variationType?: string;
  description?: string;
  about?: string[];
  isActive?: boolean;
  ownerId?: number;
}

export interface ProductDetailsPayload {
  title: string;
  code: string;
  variationType: string;
  details: Record<string, unknown>;
  about: string[];
  description: string;
}

export interface AssignRolePayload {
  email: string;
  roleId: number;
}

export const RoleIds = {
  Customer: 1,
  Merchant: 2,
  Admin: 3,
} as const;

export type RoleIds = typeof RoleIds[keyof typeof RoleIds];
