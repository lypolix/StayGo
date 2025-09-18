export type Amenity = 
  | 'wifi' 
  | 'pool' 
  | 'parking' 
  | 'restaurant' 
  | 'breakfast' 
  | 'ac' 
  | 'tv' 
  | 'gym' 
  | 'spa' 
  | 'bar' 
  | 'laundry' 
  | 'roomService' 
  | 'airportShuttle' 
  | 'businessCenter' 
  | 'petFriendly';

export interface HotelImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface RoomType {
  id: string;
  beds: number;
  price: number;
  rating: number;
  description: string;
  hotelId: string;
  images?: string[];
  isAvailable?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  tripType?: 'business' | 'leisure' | 'family' | 'couple' | 'solo';
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  description: string;
  stars: number;
  roomId: string;  // Single room ID reference
  address: string;  // Simple string address
  rooms: string[];  // Array of room IDs
  rating?: number;
  images?: HotelImage[];
  amenities?: Amenity[];
  isFavorite?: boolean;
}

export interface HotelSearchParams {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minStars?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'stars';
  sortOrder?: 'asc' | 'desc';
}

export interface HotelSearchResponse {
  data: Hotel[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters?: {
    minPrice: number;
    maxPrice: number;
    cities: Array<{ name: string; count: number }>;
    starRatings: Array<{ stars: number; count: number }>;
  };
}

export interface BookingRequest {
  roomId: string;
  userId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
  totalPrice: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  paymentInfo: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string; // MM/YY format
    cvv: string;
  };
}

export interface BookingResponse {
  id: string;
  roomId: string;
  userId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  paymentInfo: {
    lastFourDigits: string;
    cardType?: string;
  };
  createdAt: string;
  updatedAt: string;
}
