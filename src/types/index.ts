export type UserRole = 'guest' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  nationality?: string;
  purpose?: 'migration' | 'nomad' | 'tourism';
  bio?: string;
}

export type PropertyArea = 'naha' | 'okinawa-city' | 'chatan';

export interface Property {
  id: string;
  name: string;
  area: PropertyArea;
  address: string;
  description: string;
  images: string[];
  maxGuests: number;
  wifi: boolean;
  amenities: string[];
  monthlyRate: number;
  weeklyRate: number;
  occupancyRate: number;
}

export type PlanType = 'short' | 'standard' | 'long';

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  description: string;
  durationMin: number;
  durationMax: number;
  basePrice: number;
  features: string[];
}

export interface Option {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  planId: string;
  optionIds: string[];
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  smartLockCode: string;
  isLocked: boolean;
}

export interface TroubleReport {
  id: string;
  bookingId: string;
  userId: string;
  category: 'facility' | 'appliance' | 'wifi' | 'cleaning' | 'other';
  title: string;
  description: string;
  photoUrls: string[];
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface CleaningRequest {
  id: string;
  bookingId: string;
  userId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  type: 'qa' | 'review' | 'info';
  title: string;
  content: string;
  tags: string[];
  likes: number;
  createdAt: string;
  replies?: CommunityReply[];
}

export interface CommunityReply {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface LocalInfo {
  id: string;
  category: 'restaurant' | 'event' | 'coworking' | 'shop';
  name: string;
  description: string;
  address: string;
  area: PropertyArea;
  rating?: number;
  tags: string[];
}

export interface Coupon {
  id: string;
  shopName: string;
  description: string;
  discount: string;
  validUntil: string;
  area: PropertyArea;
  code: string;
}

export interface MigrationConsultation {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface RecommendAnswers {
  purpose: 'work' | 'tourism' | 'migration' | null;
  duration: 'short' | 'medium' | 'long' | null;
  priority: 'price' | 'location' | 'community' | null;
}
