import { baseApi } from '@/app/api/baseApi';
import type { User } from './types';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authApi.util.upsertQueryData('getUserProfile', undefined, {
              id: '',
              email: '',
              name: '',
              role: 'user',
              createdAt: '',
              updatedAt: '',
            })
          );
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),

    register: builder.mutation<{ token: string }, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    getUserProfile: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['Me'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authApi.util.upsertQueryData('getUserProfile', undefined, data)
          );
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
} = authApi;
