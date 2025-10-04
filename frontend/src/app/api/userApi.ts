import { baseApi } from '@/app/api/baseApi';
import type { UserProfile, UpdateProfileData } from '@/features/user/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получить текущий профиль пользователя
    getProfile: builder.query<UserProfile, void>({
      query: () => '/users/me',
      providesTags: ['Me'],
    }),

    // Обновить профиль пользователя
    updateProfile: builder.mutation<UserProfile, UpdateProfileData>({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Me'],
    }),

    // Получить список избранных отелей
    getFavoriteHotels: builder.query<Array<{
      id: string;
      name: string;
      description: string;
      address: {
        city: string;
        country: string;
      };
      starRating: number;
      image: string;
      price: number;
      amenities: string[];
    }>, void>({
      query: () => '/users/me/favorites',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Favorites' as const, id })),
              { type: 'Favorites', id: 'LIST' },
            ]
          : [{ type: 'Favorites', id: 'LIST' }],
    }),

    // Добавить отель в избранное
    addToFavorites: builder.mutation<void, string>({
      query: (hotelId) => ({
        url: `/users/me/favorites/${hotelId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
    }),

    // Удалить отель из избранного
    removeFromFavorites: builder.mutation<void, string>({
      query: (hotelId) => ({
        url: `/users/me/favorites/${hotelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, hotelId) => [
        { type: 'Favorites', id: hotelId },
        { type: 'Favorites', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetFavoriteHotelsQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = userApi;