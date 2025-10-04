/* Блок будет дорабатываться */

import { baseApi } from './baseApi';

type Review = {
  id: string;
  roomId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type CreateReviewDto = {
  roomId: string;
  rating: number;
  comment: string;
};

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], string>({
      query: (roomId) => ({
        url: '/reviews',
        params: { roomId }
      }),
      providesTags: (result = [], _error, roomId) => [
        { type: 'Review', id: 'LIST', roomId },
        ...result.map(({ id }) => ({ type: 'Review' as const, id }))
      ]
    }),
    createReview: builder.mutation<Review, CreateReviewDto>({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData
      }),
      invalidatesTags: (_result, _error, { roomId }) => [
        { type: 'Review', id: 'LIST', roomId },
        { type: 'Room', id: roomId }
      ]
    })
  })
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation
} = reviewApi;
