import { Box, Container, Spinner } from '@chakra-ui/react';
import Navbar from '@/shared/components/Navbar';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useGetMeQuery } from '@/features/auth/authApi';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('access_token'),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
