import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type RootState } from '@/app/store';
import { type Hotel, type HotelSearchParams, type BookingRequest, type BookingResponse } from './types';
import type { Room } from '@/shared/types';

// Define a service using a base URL and expected endpoints
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
    // Search hotels
    searchHotels: builder.query<{ data: Hotel[]; total: number }, HotelSearchParams>({
      query: (params) => ({
        url: '/search',
        params: {
          ...params,
          // Convert arrays to comma-separated strings if needed
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
    
    // Get room by ID
    getRoomById: builder.query<Room, string>({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Room', id }],
    }),
    
    // Get hotel by ID
    getHotelById: builder.query<Hotel, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),
    
    // Get featured hotels
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
    
    // Get similar hotels
    getSimilarHotels: builder.query<Hotel[], { hotelId: string; limit?: number }>({
      query: ({ hotelId, limit = 3 }) => `/${hotelId}/similar?limit=${limit}`,
      providesTags: (result, error, { hotelId }) => [
        { type: 'Hotel', id: `SIMILAR-${hotelId}` },
      ],
    }),
    
    // Create a booking
    createBooking: builder.mutation<BookingResponse, BookingRequest>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    
    // Get user bookings
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
    
    // Get booking by ID
    getBookingById: builder.query<BookingResponse, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    
    // Cancel booking
    cancelBooking: builder.mutation<BookingResponse, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'USER' },
      ],
    }),
    
    // Toggle favorite hotel
    toggleFavorite: builder.mutation<{ isFavorite: boolean }, string>({
      query: (hotelId) => ({
        url: `/${hotelId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, hotelId) => [
        { type: 'Hotel', id: hotelId },
        { type: 'Favorite', id: 'LIST' },
      ],
    }),
    
    // Get favorite hotels
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
    
    // Get hotel reviews
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
      providesTags: (result, error, { hotelId }) => [
        { type: 'Hotel', id: `${hotelId}-reviews` },
      ],
    }),
    
    // Submit a review
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
      invalidatesTags: (result, error, { hotelId }) => [
        { type: 'Hotel', id: hotelId },
        { type: 'Hotel', id: `${hotelId}-reviews` },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
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
} = hotelsApi;
