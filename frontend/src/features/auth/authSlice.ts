import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from './authApi';
import { clearAuthTokens, setAuthTokens } from '@/utils/auth';
import type { AuthState } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user?: User | null; token?: string }>) => {
      const { user, token } = action.payload;
      if (typeof user !== 'undefined') {
        state.user = user;
      }
      if (typeof token !== 'undefined') {
        state.token = token;
        state.isAuthenticated = !!token;
        state.error = null;
        if (token) localStorage.setItem('access_token', token);
      } else {
        // если кладём только user — не трогаем isAuthenticated/token
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      clearAuthTokens();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle login success
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled') && action.type.includes('getMe'),
      (state, action: any) => {
        state.user = action.payload || null;
        if (state.token) state.isAuthenticated = true;
      }
    );
    
    // Handle login error
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected') && action.type.includes('login'),
      (state, action: any) => {
        state.loading = false;
        state.error = action.error?.message || 'Login failed';
      }
    );
    
    // Handle getMe success
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled') && action.type.includes('getMe'),
      (state, action: any) => {
        state.user = action.payload || null;
        state.isAuthenticated = !!action.payload;
      }
    );
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;
