import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type RootState } from '@/app/store';
import { type Hotel, type HotelSearchParams, type BookingRequest, type BookingResponse } from './types';
import type { Room, Review } from '@/shared/types';

// Определяем сервис с использованием базового URL и ожидаемых эндпоинтов
export const hotelsApi = createApi({
  reducerPath: 'hotelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/hotels`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Hotel', 'Booking', 'Favorite', 'Room'],
  endpoints: (builder) => ({
    // Поиск отелей
    searchHotels: builder.query<{ data: Hotel[]; total: number }, HotelSearchParams>({
      query: (params) => ({
        url: '/search',
        params: {
          ...params,
          amenities: Array.isArray(params.amenities) 
            ? params.amenities.join(',') 
            : params.amenities,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Hotel' as const, id })),
              { type: 'Hotel', id: 'LIST' },
            ]
          : [{ type: 'Hotel', id: 'LIST' }],
    }),
    
    getReviewsByRoomId: builder.query<Review[], number>({
      query: (roomId) => ({
        url: '/reviews',
        params: { room_id: roomId },
      }),
    }),

    // Получение номера по ID
    getRoomById: builder.query<Room, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Room', id }],
    }),
    
    // Получение отеля по ID
    getHotelById: builder.query<Hotel, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Hotel', id }],
    }),
    
    // Получение популярных отелей
    getFeaturedHotels: builder.query<Hotel[], void>({
      query: () => '/featured',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hotel' as const, id })),
              { type: 'Hotel', id: 'FEATURED' },
            ]
          : [{ type: 'Hotel', id: 'FEATURED' }],
    }),
    
    // Получение похожих отелей
    getSimilarHotels: builder.query<Hotel[], { hotelId: string; limit?: number }>({
      query: ({ hotelId, limit = 3 }) => `/${hotelId}/similar?limit=${limit}`,
      providesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: `SIMILAR-${hotelId}` },
      ],
    }),
    
    // Создание бронирования
    createBooking: builder.mutation<BookingResponse, BookingRequest>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    
    // Получение бронирований пользователя
    getUserBookings: builder.query<BookingResponse[], void>({
      query: () => '/bookings/me',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Booking' as const, id })),
              { type: 'Booking', id: 'USER' },
            ]
          : [{ type: 'Booking', id: 'USER' }],
    }),
    
    // Получение бронирования по ID
    getBookingById: builder.query<BookingResponse, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
    
    // Отмена бронирования
    cancelBooking: builder.mutation<BookingResponse, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'USER' },
      ],
    }),
    
    // Изменение избранного отеля
    toggleFavorite: builder.mutation<{ isFavorite: boolean }, string>({
      query: (hotelId) => ({
        url: `/${hotelId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, hotelId) => [
        { type: 'Hotel', id: hotelId },
        { type: 'Favorite', id: 'LIST' },
      ],
    }),
    
    // Получение избранных отелей
    getFavoriteHotels: builder.query<Hotel[], void>({
      query: () => '/favorites',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Hotel' as const, id })),
              { type: 'Favorite', id: 'LIST' },
            ]
          : [{ type: 'Favorite', id: 'LIST' }],
    }),
    
    // Получение отзывов на отель
    getHotelReviews: builder.query<{
      data: Array<{
        id: string;
        rating: number;
        comment: string;
        createdAt: string;
        user: {
          id: string;
          name: string;
          avatar?: string;
        };
      }>;
      averageRating: number;
      total: number;
    }, { hotelId: string; page?: number; limit?: number }>({
      query: ({ hotelId, page = 1, limit = 10 }) => ({
        url: `/${hotelId}/reviews`,
        params: { page, limit },
      }),
      providesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: `${hotelId}-reviews` },
      ],
    }),
    
    // Отправка отзыва
    submitReview: builder.mutation<
      void,
      {
        hotelId: string;
        rating: number;
        comment: string;
      }
    >({
      query: ({ hotelId, ...reviewData }) => ({
        url: `/${hotelId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'Hotel', id: hotelId },
        { type: 'Hotel', id: `${hotelId}-reviews` },
      ],
    }),
  }),
});

// Экспортируем хуки для использования в функциональных компонентах,
// которые автоматически генерируются на основе определенных эндпоинтов
export const {
  useSearchHotelsQuery,
  useGetHotelByIdQuery,
  useGetRoomByIdQuery,
  useGetFeaturedHotelsQuery,
  useGetSimilarHotelsQuery,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
  useToggleFavoriteMutation,
  useGetFavoriteHotelsQuery,
  useGetHotelReviewsQuery,
  useSubmitReviewMutation,
  useGetReviewsByRoomIdQuery,
} = hotelsApi;
