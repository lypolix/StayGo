/**
 * Hotels API (RTK Query)
 * Endpoints:
 * - getHotels: list with optional filters
 * - getHotelById: single hotel by id
 * - getHotelRooms: rooms for a specific hotel
 * - createHotel: create a new hotel (admin only)
 * Cache tags used: 'Hotels' (LIST), 'Hotel' (by id), 'Room' (LIST-<hotelId>)
 */

import { baseApi } from '@/app/api/baseApi';
import type { Hotel, Room } from '@/shared/types';

export interface HotelsListParams {
  q?: string;
  city?: string;
}

export interface CreateHotelRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating?: number;
  amenities?: string[];
  images?: string[];
}

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query<Hotel[], HotelsListParams | void>({
      query: (params) => (params ? { url: '/hotels', params } : '/hotels'),
      providesTags: (result) =>
        result?.length
          ? [
              { type: 'Hotels' as const, id: 'LIST' },
              ...result.map((h) => ({ type: 'Hotel' as const, id: h.id })),
            ]
          : [{ type: 'Hotels' as const, id: 'LIST' }],
    }),

    getHotelById: builder.query<Hotel, string>({
      query: (id) => `/hotels/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Hotel' as const, id }],
    }),

    createHotel: builder.mutation<Hotel, CreateHotelRequest>({
      query: (hotelData) => ({
        url: '/hotels',
        method: 'POST',
        body: hotelData,
      }),
      invalidatesTags: [{ type: 'Hotels', id: 'LIST' }],
    }),

    getHotelRooms: builder.query<Room[], string>({
      query: (hotelId) => `/hotels/${hotelId}/rooms`,
      providesTags: (_result, _error, hotelId) => [
        { type: 'Hotel' as const, id: hotelId },
        { type: 'Room' as const, id: `LIST-${hotelId}` },
      ],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useGetHotelRoomsQuery,
} = hotelsApi;
