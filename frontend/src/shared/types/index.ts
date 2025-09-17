// Base entity interface with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Address type for locations
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

// Image type for hotel and room images
export interface Image {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

// Hotel type
export interface Hotel extends BaseEntity {
  name: string;
  description: string;
  address: Address;
  starRating: number;
  amenities: string[];
  images: Image[];
  isFeatured?: boolean;
  isFavorite?: boolean;
  pricePerNight: number;
  availableRooms: number;
  rating: number;
  reviewCount: number;
}

// Room type
export interface Room extends BaseEntity {
  room_id: number;
  hotelId: string;
  name: string;
  description: string;
  maxOccupancy: number;
  pricePerNight: number;
  originalPrice?: number;
  discountPercent?: number;
  availableRooms: number;
  amenities: string[];
  images: Image[];
  size: string; // e.g., '300 sq.ft'
  bedType: string; // e.g., 'King', 'Queen', 'Twin'
  isFavorite?: boolean;
  freeCancellationBefore?: number; // Days before check-in when free cancellation is available
  cancellationPolicy?: string; // Description of the cancellation policy
  specialOffers?: Array<{
    id: string;
    title: string;
    description: string;
    terms?: string;
    validUntil?: string;
  }>;
}

// Review type
export interface Review extends BaseEntity {
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  stayDate: string;
  tripType?: 'business' | 'leisure' | 'family' | 'couple' | 'solo';
  roomType?: string;
  response?: {
    message: string;
    respondedAt: string;
  };
}

// Booking type
export interface Booking extends BaseEntity {
  userId: string;
  roomId: string;
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  guestName: string;
  guestEmail: string;
  specialRequests?: string;
}

// User type (extended from auth types)
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  phoneNumber?: string;
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

// Search parameters
export interface SearchParams {
  destination?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  starRating?: number[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common form field props
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  touched?: boolean;
}
