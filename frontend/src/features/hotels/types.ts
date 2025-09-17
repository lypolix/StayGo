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
  name: string;
  description: string;
  maxOccupancy: number;
  pricePerNight: number;
  availableRooms: number;
  amenities: Amenity[];
  images: HotelImage[];
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
  location: string; // Short location string for display
  rating: number;
  starRating: 1 | 2 | 3 | 4 | 5;
  price: number; // Starting price
  amenities: Amenity[];
  images: HotelImage[];
  roomTypes: RoomType[];
  policies?: {
    checkIn?: string;
    checkOut?: string;
    cancellation?: string;
    petsAllowed?: boolean;
    creditCardsAccepted?: boolean;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  reviews?: Review[];
  reviewCount?: number;
  averageRating?: number;
  distanceFromCenter?: number; // in km/miles
  isFeatured?: boolean;
  isAvailable?: boolean;
  isFavorite?: boolean;
  lastRenovatedYear?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HotelSearchParams {
  search?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string; // Comma-separated list of amenity IDs
  sortBy?: 'price' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
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
    amenities: Array<{ id: string; name: string; count: number }>;
    starRatings: Array<{ rating: number; count: number }>;
  };
}

export interface BookingRequest {
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialRequests?: string;
  };
  paymentInfo: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface BookingResponse {
  id: string;
  bookingNumber: string;
  hotel: Hotel;
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}
