import type { BaseEntity } from '@/shared/types';
import type { User } from '@/features/auth/types';
import type { Hotel } from '@/features/hotels/types';

export interface UserProfile extends BaseEntity, User {
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
}

export interface FavoriteHotel {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  location: string;
  rating: number;
  starRating: 1 | 2 | 3 | 4 | 5;
  price: number;
  amenities: string[];
  image: string;
  isFavorite?: boolean;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  reviewCount?: number;
  averageRating?: number;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface BookingHistory {
  id: string;
  hotel: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingDate: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}
