import { baseApi } from './baseApi';

type RoomIDDTO = {
  room_id: number;
};

export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => '/favorites',
      providesTags: ['Favorites']
    }),
    addToFavorites: builder.mutation<void, { room_id: number }>({
      query: (data) => ({
        url: '/favorites',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Favorites']
    }),
    removeFromFavorites: builder.mutation<void, { room_id: number }>({
      query: ({ room_id }) => ({
        url: `/favorites/${room_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites']
    })
  })
});

export const {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation
} = favoriteApi;
