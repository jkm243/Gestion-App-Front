// User Types
export type UserRole = 'ADMIN' | 'CASHIER';

export interface Role {
  id: number;
  name: UserRole;
  description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  role: Role;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity_in_stock: number;
  category: string;
  barcode: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

// Sale Types
export interface SaleItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Sale {
  id: number;
  sale_number: string;
  user_id: number; // Cashier who made the sale
  sale_date: string;
  total_amount: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  items: SaleItem[];
  payment_method: 'CASH' | 'CARD' | 'TRANSFER';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Invoice Types
export interface Invoice {
  id: number;
  sale_id: number;
  invoice_number: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  issue_date: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  fullname: string;
  password: string;
  password_confirm: string;
  role_id: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity_in_stock: number;
  category: string;
  barcode: string;
  image?: File;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
