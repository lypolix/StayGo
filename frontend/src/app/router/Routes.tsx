import { Suspense, lazy } from 'react';
import { Routes as RouterRoutes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import type { RootState } from '../store';
import { Layout } from '../components/Layout';
import { useState, useEffect } from 'react';
import { authApi } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';

// Lazy load route components for better performance
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage').then(module => ({ default: module.default })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(module => ({ default: module.default })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(module => ({ default: module.default })));
const SearchPage = lazy(() => import('@/features/hotels/pages/SearchPage').then(module => ({ default: module.default })));
const HotelPage = lazy(() => import('@/features/hotels/pages/HotelDetailPage').then(module => ({ default: module.default })));
const RoomPage = lazy(() => import('@/features/hotels/pages/RoomPage').then(module => ({ default: module.default })));
const ProfilePage = lazy(() => import('@/features/user/pages/ProfilePage').then(module => ({ default: module.default })));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
    <Spinner size="xl" />
  </Box>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // If we have a token but not authenticated, try to fetch the user
          if (!isAuthenticated) {
            const user = await dispatch(
              authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
            ).unwrap();
            
            dispatch(setCredentials({ user, token }));
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          if (error && typeof error === 'object' && 'status' in error) {
            const apiError = error as { status: number; data?: { message?: string } };
            console.error('Auth API error status:', apiError.status);
            if (apiError.data?.message) {
              console.error('Error message:', apiError.data.message);
            }
          }
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsVerifying(false);
    };

    verifyAuth();
  }, [dispatch, isAuthenticated]);

  if (isVerifying) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with the current location to return to after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public route component (only for non-authenticated users)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  if (isAuthenticated) {
    // Don't redirect if we're already on the login page
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/profile" replace />;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterRoutes>
        {/* All routes with layout */}
        <Route element={<Layout><Outlet /></Layout>}>
          {/* Root route with layout */}
          <Route path="/" element={<LandingPage />} />
          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hotels/:hotelId"
            element={
              <ProtectedRoute>
                <HotelPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/rooms/:roomId"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </Suspense>
  );
};

export default AppRoutes;
