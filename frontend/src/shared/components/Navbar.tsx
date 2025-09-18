import { Box, Button, Flex, HStack, IconButton, useDisclosure, useColorModeValue, Stack, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout, setCredentials } from '@/features/auth/authSlice';
import { useGetMeQuery } from '@/features/auth/api';
import { Logo } from './Logo';

// TODO: добавить ссылки на отели и бронирования
{/*const Links = [
  { name: 'Отели', path: '/hotels' },
  { name: 'Бронирования', path: '/bookings' },
];*/}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector(state => state.auth.user);
  
  const { data: userData, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (userData && isAuthenticated) {
      dispatch(setCredentials({ user: userData, token: localStorage.getItem('access_token') || '' }));
    }
  }, [userData, isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} boxShadow="sm">
      <Flex h={16} alignItems='center' justifyContent='space-between' maxW="container.xl" mx="auto">
        <Logo />
        
        {/* <HStack spacing={8} alignItems='center'>
          <HStack as='nav' spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <Link key={link.name} to={link.path}>
                <Button variant="ghost">
                  {link.name}
                </Button>
              </Link>
            ))}
          </HStack>
        </HStack> */}

        <Flex alignItems='center'>
          <IconButton
            size='md'
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            aria-label='Toggle color mode'
            variant='ghost'
            onClick={toggleColorMode}
            mr={2}
          />
          
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/profile" variant='ghost' mr={2}>
                Профиль
              </Button>
              <Button colorScheme='blue' variant='ghost' onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant='ghost' mr={2}>
                Войти
              </Button>
              <Button as={Link} to="/register" colorScheme='blue'>
                Регистрация
              </Button>
            </>
          )}

          <IconButton
            size='md'
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label='Open Menu'
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            ml={2}
          />
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          {/*<Stack as='nav' spacing={4}>
            {Links.map((link) => (
              <Link key={link.name} to={link.path} onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  {link.name}
                </Button>
              </Link>
            ))}
          </Stack>*/}
        </Box>
      ) : null}
    </Box>
  );
}
