// Интерфейс BaseEntity с общими полями
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Интерфейс Address для локации
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

// Интерфейс Image для отеля и номера
export interface Image {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

// Интерфейс Hotel для отеля
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
  reviews?: Review[];
}

// Интерфейс Room для номера
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
  size: string; // например, '300 sq.ft'
  bedType: string; // например, 'King', 'Queen', 'Twin'
  isFavorite?: boolean;
  freeCancellationBefore?: number; // Дней до заезда, когда доступна бесплатная отмена
  cancellationPolicy?: string; // Описание политики отмены
  specialOffers?: Array<{
    id: string;
    title: string;
    description: string;
    terms?: string;
    validUntil?: string;
  }>;
}

// Интерфейс Review для отзыва
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

// Интерфейс Booking для бронирования
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

// Интерфейс User для пользователя (расширенный из типов авторизации)
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  role?: string;
  city?: string;
  address?: {
    street?: string;
    city?: string;
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

// Интерфейс SearchParams для параметров поиска
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

// Интерфейс ApiResponse для обертки API ответа
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

// Интерфейс PaginationParams для параметров пагинации
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Интерфейс FormFieldProps для общих свойств поля формы
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
