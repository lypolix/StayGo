import { baseApi } from '@/app/api/baseApi';
import type { User } from '../../features/auth/types';
import { setCredentials, logout } from '../../features/auth/authSlice';

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
          if (data.token) {
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

    // Получить текущего пользователя
    getMe: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['Me'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data,
              token: localStorage.getItem('access_token') || ''
            })
          );
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
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
  useGetMeQuery: useGetUserProfileQuery,
} = authApi;
