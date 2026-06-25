// Shared TypeScript types — mirrors backend/src/types/index.ts

export type UserRole = 'super_admin' | 'branch_manager' | 'staff' | 'member';

export type PaymentProvider = 'mock' | 'whish';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string;
  companyId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// ─── Company / Branch ─────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  address: string;
  phone?: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Zone / Station ───────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  _id?: string;
  branchId: string;
  name: string;
  type: 'console' | 'pc' | 'vr' | 'arcade' | 'pool' | 'other';
  capacity: number;
  pricePerHour: number;
  isActive: boolean;
}

// ─── Booking / PlaySession ────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  _id?: string;
  branchId: string;
  zoneId: string;
  memberId?: string;
  guestName?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  status: BookingStatus;
  checkedInAt?: string;
  notes?: string;
  createdAt: string;
}

// ─── Member ───────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  _id?: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  totalSpend: number;
  memberSince: string;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  companyId: string;
  name: string;
  price: number;
  billingPeriodDays: number;
  features: string[];
  loyaltyMultiplier: number;
  isActive: boolean;
}

// ─── Product / Inventory ──────────────────────────────────────────────────────

export interface Product {
  id: string;
  _id?: string;
  branchId: string;
  name: string;
  category: 'snack' | 'drink' | 'merchandise' | 'other';
  price: number;
  costPrice: number;
  stock: number;
  reorderThreshold: number;
  isActive: boolean;
}

// ─── Order / POS ──────────────────────────────────────────────────────────────

export interface OrderLine {
  type: 'session' | 'product';
  refId: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  branchId: string;
  cashierId: string;
  memberId?: string;
  lines: OrderLine[];
  subtotal: number;
  discountAmount: number;
  loyaltyRedeemed: number;
  taxAmount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  createdAt: string;
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export type AlertType =
  | 'low_stock'
  | 'maintenance_due'
  | 'payment_overdue'
  | 'subscription_expiry'
  | 'custom';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  _id?: string;
  branchId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  isAcknowledged: boolean;
  isResolved: boolean;
  createdAt: string;
}

// ─── Report ───────────────────────────────────────────────────────────────────

export interface DailyReport {
  id: string;
  _id?: string;
  branchId: string;
  date: string;
  totalRevenue: number;
  sessionRevenue: number;
  productRevenue: number;
  totalOrders: number;
  completedSessions: number;
  newMembers: number;
  loyaltyPointsAwarded: number;
  loyaltyPointsRedeemed: number;
  topProducts?: Array<{ productId: string; name: string; qty: number; revenue: number }>;
  generatedAt: string;
  createdAt: string;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiSuccess<T = unknown> {
  status: 'success';
  data: T;
  pagination?: Pagination;
}

export interface ApiError {
  status: 'error';
  message: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
