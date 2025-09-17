import { baseApi } from '@/app/api/baseApi';
import type { Room } from '@/shared/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<{
      id: string;
      email: string;
      name: string;
      avatar?: string;
    }, void>({
      query: () => '/users/me',
      providesTags: ['Me'],
    }),

    // Get user's favorite rooms
    getFavorites: builder.query<Room[], void>({
      query: () => '/users/me/favorites',
      providesTags: ['Favorites'],
    }),

    // Add room to favorites
    addFavorite: builder.mutation<void, { roomId: string }>({
      query: ({ roomId }) => ({
        url: `/users/me/favorites/${roomId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Remove room from favorites
    removeFavorite: builder.mutation<void, { roomId: string }>({
      query: ({ roomId }) => ({
        url: `/users/me/favorites/${roomId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = userApi;
