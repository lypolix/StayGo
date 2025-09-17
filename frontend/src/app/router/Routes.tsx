import { Suspense, lazy } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route component (only for non-authenticated users)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterRoutes>
        {/* Public routes */}
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

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </Suspense>
  );
};

export default AppRoutes;
