import { baseApi } from './baseApi';
import { setCredentials } from '../../features/auth/authSlice';

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  city?: string;
  date_of_birth?: string;
  role?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  role?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zipCode?: string;
  };
};

type LoginResponse = {
  access_token: string;
  refresh_token?: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (!data.access_token) {
            throw new Error('Отсутствует access_token в ответе на запрос');
          }
          const accessToken = data.access_token;
    
          localStorage.setItem('access_token', accessToken);
          if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
    
          dispatch(setCredentials({ token: accessToken }));
    
          const me = await dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
          ).unwrap();
    
          dispatch(setCredentials({ user: me }));
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),
    
    register: builder.mutation<void, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          city: userData.city || '',
          date_of_birth: userData.date_of_birth || null,
          role: userData.role || 'user',
        },
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['Me'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} = authApi;
