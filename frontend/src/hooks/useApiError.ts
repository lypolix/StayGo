import { useCallback } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useToast } from '@chakra-ui/react';

type ApiError = {
  status: number;
  data: {
    message?: string;
    error?: string;
  };
};

export const useApiError = () => {
  const toast = useToast();

  const handleError = useCallback((error: FetchBaseQueryError | any) => {
    const apiError = error as ApiError;
    const errorMessage = 
      (apiError.data?.message || 
       apiError.data?.error || 
       'An unexpected error occurred. Please try again.');

    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    // You can add more specific error handling here based on status code
    if (apiError.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
    }
  }, [toast]);

  return { handleError };
};
