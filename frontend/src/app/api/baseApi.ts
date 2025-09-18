import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token ?? localStorage.getItem('access_token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
    //credentials: 'include',
  }),
  tagTypes: ['Me', 'Hotels', 'Hotel', 'Room', 'Favorites', 'Review'],
  endpoints: () => ({}),
});
