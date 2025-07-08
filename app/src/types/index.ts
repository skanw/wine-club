import React from 'react';

/**
 * Common Types and Interfaces
 */

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  preferences: UserPreferences;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'customer' | 'guest';

export interface UserPreferences {
  theme: ThemePreference;
  notifications: NotificationPreferences;
  language: string;
  currency: string;
}

export type ThemePreference = 'light' | 'dark' | 'high-contrast' | 'luxury';

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
}

export type SubscriptionPlan = 'basic' | 'premium' | 'luxury';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'pending';

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

// Payment Types
export interface PaymentMethod {
  id: string;
  type: PaymentType;
  provider: PaymentProvider;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export type PaymentType = 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal';

export type PaymentProvider = 'stripe' | 'paypal' | 'lemon_squeezy';

// Wine Types
export interface Wine {
  id: string;
  name: string;
  description: string;
  type: WineType;
  vintage: number;
  region: string;
  country: string;
  price: Price;
  rating: number;
  stock: number;
  images: WineImage[];
  attributes: WineAttributes;
}

export type WineType = 'red' | 'white' | 'rose' | 'sparkling' | 'dessert';

export interface WineImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface WineAttributes {
  alcoholContent: number;
  body: WineBody;
  acidity: WineAcidity;
  tannin: WineTannin;
  sweetness: WineSweetness;
  notes: string[];
}

export type WineBody = 'light' | 'medium' | 'full';
export type WineAcidity = 'low' | 'medium' | 'high';
export type WineTannin = 'soft' | 'medium' | 'firm';
export type WineSweetness = 'dry' | 'off-dry' | 'sweet';

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  payment: Payment;
  subtotal: Price;
  tax: Price;
  shipping: Price;
  total: Price;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  wineId: string;
  quantity: number;
  price: Price;
  total: Price;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Common Types
export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Price {
  amount: number;
  currency: string;
  formatted: string;
}

export interface Payment {
  id: string;
  amount: Price;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId: string;
  createdAt: Date;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
}

export interface ErrorProps extends BaseComponentProps {
  error: Error | string;
  retry?: () => void;
}

// Theme Types
export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
}

export interface ThemeColors {
  primary: ColorShades;
  secondary: ColorShades;
  neutral: ColorShades;
  success: ColorShades;
  warning: ColorShades;
  error: ColorShades;
}

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

export interface ThemeSpacing {
  px: string;
  0: string;
  0.5: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeShadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface ThemeAnimations {
  duration: {
    75: string;
    100: string;
    150: string;
    200: string;
    300: string;
    500: string;
    700: string;
    1000: string;
  };
  easing: {
    linear: string;
    in: string;
    out: string;
    inOut: string;
  };
} 