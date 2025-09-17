import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { useGetUserProfileQuery } from '@/features/auth/api';

export const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: user } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Box>
          <Text as={RouterLink} to="/" fontWeight="bold" fontSize="xl">
            StayGo
          </Text>
        </Box>

        <Flex alignItems="center">
          <Stack direction="row" spacing={4} alignItems="center">
            <Button onClick={toggleColorMode} variant="ghost">
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar
                    size="sm"
                    name={user?.name || 'User'}
                    src=""
                    bg="brand.500"
                    color="white"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Sign in
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="brand"
                  display={{ base: 'none', md: 'inline-flex' }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            {isAuthenticated ? (
              <>
                <Button as={RouterLink} to="/profile" variant="ghost" justifyContent="flex-start">
                  Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  justifyContent="flex-start"
                  colorScheme="red"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={RouterLink} to="/login" variant="ghost" justifyContent="flex-start">
                  Sign in
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="brand"
                  justifyContent="flex-start"
                >
                  Sign up
                </Button>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
