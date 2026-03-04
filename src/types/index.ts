// ============================================================================
// Authentication & User Types (from OpenAPI)
// ============================================================================

export interface Role {
  id: string; // UUID
  name: string; // e.g., 'admin', 'cashier' (normalized to uppercase by frontend)
  description?: string;
}

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  fullname?: string;
  role: Role;
  is_active: boolean;
  created_at: string; // ISO timestamp
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  token: TokenPair;
  user: User;
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

export interface SignupRequest {
  email: string;
  password1: string;
  password2: string;
  fullname?: string;
  username: string;
  role?: string; // UUID of role
}

export interface UpdateUserRequest {
  email?: string;
  role?: string; // UUID
  fullname?: string;
  username?: string;
  is_active?: boolean;
}

// ============================================================================
// Product Types (from OpenAPI)
// ============================================================================

export type CategoryEnum =
  | 'electronics'
  | 'mode'
  | 'alimentaire'
  | 'beaute'
  | 'maison'
  | 'sport'
  | 'jouets'
  | 'autres';

export interface Supplier {
  id: string; // UUID
  name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
}

export interface Product {
  id: string; // UUID
  sku?: string;
  name?: string;
  description?: string;
  category?: CategoryEnum | null;
  supplier: Supplier; // Required object reference, not just ID
  is_active: boolean;
  unit_cost?: string; // decimal: ^-?\d{0,8}(?:\.\d{0,2})?$
  unit_price?: string; // decimal: ^-?\d{0,8}(?:\.\d{0,2})?$
}

export interface CreateProductRequest {
  sku?: string;
  name?: string;
  description?: string;
  category?: CategoryEnum | null;
  supplier: string; // UUID
  unit_cost?: string;
  unit_price?: string;
  is_active?: boolean;
}

export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  description?: string;
  category?: CategoryEnum | null;
  supplier?: string; // UUID
  unit_cost?: string;
  unit_price?: string;
  is_active?: boolean;
}

// ============================================================================
// Supplier Types (from OpenAPI)
// ============================================================================

export interface CreateSupplierRequest {
  name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: boolean;
}

export interface UpdateSupplierRequest {
  name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: boolean;
}

// ============================================================================
// Location Types (from OpenAPI)
// ============================================================================

export interface Location {
  id: string; // UUID
  name?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateLocationRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateLocationRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// ============================================================================
// Stock Types (from OpenAPI)
// ============================================================================

export interface Stock {
  id: string; // UUID
  product: string; // UUID
  product_detail?: Product; // Readonly in response
  location: string; // UUID
  location_detail?: Location; // Readonly in response
  quantity_on_hand: number;
  quantity_reserved: number;
  min_threshold: number;
  critical_threshold: number;
  last_updated?: string;
  created_at: string;
}

export interface CreateStockRequest {
  product: string; // UUID
  location: string; // UUID
  quantity_on_hand: number;
  quantity_reserved: number;
  min_threshold: number;
  critical_threshold: number;
}

export interface UpdateStockRequest {
  product?: string;
  location?: string;
  quantity_on_hand?: number;
  quantity_reserved?: number;
  min_threshold?: number;
  critical_threshold?: number;
}

// ============================================================================
// Customer Types (from OpenAPI)
// ============================================================================

export interface Customer {
  id: string; // UUID
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
}

export interface CreateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
}

// ============================================================================
// Sale Types (from OpenAPI)
// ============================================================================

export type SaleStatusEnum = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface SaleItem {
  id: string; // UUID
  product: string; // UUID
  product_detail?: Product; // Readonly
  location?: string; // UUID
  location_detail?: Location; // Readonly
  quantity: number; // 0-9223372036854775807
  unit_price: string; // decimal
  discount_amount?: string; // decimal
  total_price: string; // decimal (readonly)
  quantity_reserved: number; // readonly
  created_at: string; // ISO datetime (readonly)
}

export interface Sale {
  id: string; // UUID (readonly)
  user: string; // UUID → user_detail: User object
  user_detail?: User; // Readonly
  customer: string; // UUID → customer_detail: Customer object
  customer_detail?: Customer; // Readonly
  sale_number?: string; // readonly
  status: SaleStatusEnum;
  subtotal: string; // decimal (readonly)
  tax_amount: string; // decimal
  discount_amount: string; // decimal
  total_amount: string; // decimal (readonly)
  notes?: string;
  items?: SaleItem[]; // readonly
  created_at: string; // datetime
  updated_at: string; // datetime
  completed_at?: string; // datetime
}

export interface CreateSaleRequest {
  customer: string; // UUID
  tax_amount?: string; // decimal
  discount_amount?: string; // decimal
  notes?: string;
  items_data: Array<{
    product: string; // UUID
    location?: string; // UUID
    quantity: number;
    unit_price: string; // decimal
    discount_amount?: string; // decimal
  }>;
}

export interface AddSaleItemRequest {
  product: string; // UUID
  location?: string; // UUID
  quantity: number;
  unit_price: string; // decimal
  discount_amount?: string; // decimal
}

// ============================================================================
// API Response Types
// ============================================================================

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

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

// ============================================================================
// Form Types
// ============================================================================

export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  fullname?: string;
  password1: string;
  password2: string;
  role?: string; // UUID
}

export interface ProductFormData {
  sku?: string;
  name?: string;
  description?: string;
  category?: CategoryEnum;
  supplier: string; // UUID
  unit_cost?: string;
  unit_price?: string;
  is_active?: boolean;
}

export interface SupplierFormData {
  name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: boolean;
}

export interface CustomerFormData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
}

export interface LocationFormData {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface StockFormData {
  product: string; // UUID
  location: string; // UUID
  quantity_on_hand: number;
  quantity_reserved: number;
  min_threshold: number;
  critical_threshold: number;
}

// ============================================================================
// Invoice Types (frontend placeholder)
// ============================================================================
export interface Invoice {
  id: string;
  invoice_number?: string;
  amount?: number;
  status?: string;
  issue_date?: string;
  due_date?: string;
}

// ============================================================================
// Cart Types (if needed for future cashier flow)
// ============================================================================

export interface CartItem {
  product: Product;
  quantity: number;
  unit_price: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total: string;
}
