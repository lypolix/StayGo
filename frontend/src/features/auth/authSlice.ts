import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './api'; // <-- RTK Query endpoints (login/register/getUserProfile)
import type { User } from './types';

export interface AuthState {
  token: string | null;
  remember: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  remember: false,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },

    setCredentials(
      state,
      action: PayloadAction<{ token: string; remember: boolean }>
    ) {
      const { token, remember } = action.payload;
      state.token = token;
      state.remember = remember;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // persist token
      if (remember) {
        localStorage.setItem('staygo_token', token);
        sessionStorage.removeItem('staygo_token');
      } else {
        sessionStorage.setItem('staygo_token', token);
        localStorage.removeItem('staygo_token');
      }
    },

    setUser(
      state,
      action: PayloadAction<User>
    ) {
      state.user = action.payload;
    },

    initializeAuth(state) {
      const token =
        localStorage.getItem('staygo_token') ||
        sessionStorage.getItem('staygo_token');

      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        state.remember = !!localStorage.getItem('staygo_token');
      } else {
        state.token = null;
        state.isAuthenticated = false;
        state.remember = false;
      }
      state.loading = false;
      state.error = null;
    },

    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.remember = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('staygo_token');
      sessionStorage.removeItem('staygo_token');
    },
  },

  // <-- ВАЖНО: extraReducers на верхнем уровне, и используем matchers от RTK Query
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state) => {
        state.loading = false;
        // токен сохраняется через dispatch(setCredentials(...)) в компоненте
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? 'Login failed';
      });

    // REGISTER
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
        state.loading = false;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? 'Registration failed';
      });

    // ME
    builder
      .addMatcher(authApi.endpoints.getUserProfile.matchPending, (state) => {
        // не всегда хотим global loading на профайл, но если нужно — оставь
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.getUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.user = payload;
        }
      )
      .addMatcher(
        authApi.endpoints.getUserProfile.matchRejected,
        (state, action) => {
          state.loading = false;
          // если токен просрочен — можно обнулять auth тут, если хочешь
          // state.isAuthenticated = false;
          state.error = action.error?.message ?? 'Failed to load profile';
        }
      );
  },
});

export const {
  setCredentials,
  setUser,
  initializeAuth,
  logout,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;

// Пример селектора (лучше держать в отдельном файле selectors.ts)
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
