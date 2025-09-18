/* Блок будет дорабатываться */

import { baseApi } from './baseApi';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomById: builder.query({
      query: (id) => `/rooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Room', id }]
    }),
    createRoom: builder.mutation({
      query: (roomData) => ({
        url: '/rooms',
        method: 'POST',
        body: roomData
      }),
      invalidatesTags: (_result, _error, { hotelId }) => [
        { type: 'Room', id: 'LIST', hotelId },
        { type: 'Hotel', id: hotelId }
      ]
    })
  })
});

export const {
  useGetRoomByIdQuery,
  useCreateRoomMutation
} = roomApi;
