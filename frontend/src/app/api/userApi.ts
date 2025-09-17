import { baseApi } from '@/app/api/baseApi';

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
  }),
});

export const {
  useGetProfileQuery,
} = userApi;
