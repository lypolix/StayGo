import { baseApi } from '@/app/api/baseApi';
import type { User } from './types';
import { setCredentials, logout } from './authSlice';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  date_of_birth?: string | null;
  city?: string;
  role?: string;
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
          // The backend only returns tokens, we'll fetch the user profile separately
          if (data.token) {
            // Trigger a refetch of the user profile
            dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }));
          }
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

    // Get current user's profile
    getMe: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['Me'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Update the auth state with the user data
          dispatch(
            setCredentials({
              user: data,
              token: localStorage.getItem('access_token') || ''
            })
          );
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If the request fails, clear the auth state
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetMeQuery: useGetUserProfileQuery, // Alias for backward compatibility
} = authApi;
