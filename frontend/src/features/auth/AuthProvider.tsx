import { type ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserProfileQuery } from './api';
import { initializeAuth } from './authSlice';
import { type AppDispatch, type RootState } from '@/app/store';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Initialize auth state from storage on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Fetch user profile when authenticated
  const { isLoading } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  // Show loading state while initializing auth
  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return <>{children}</>;
};
