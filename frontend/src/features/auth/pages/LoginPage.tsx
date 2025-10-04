import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Link,
  useToast,
  FormErrorMessage,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useLoginMutation } from '../../../app/api/authApi';
import { setCredentials } from '../authSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  
  // Получаем редирект или по умолчанию '/profile'
  const from = location.state?.from?.pathname || '/profile';

  // Перенаправляем, если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      // Сохраняем токены
      const accessToken = (response as any).access_token || (response as any).token;
      const refreshToken = (response as any).refresh_token;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      // Устанавливаем состояние авторизации до переходов
      if (accessToken) {
        dispatch(setCredentials({ user: (response as any).user, token: accessToken }));
      }

      // Показываем сообщение об успехе
      toast({
        title: 'Вход выполнен успешно',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Перенаправляем на нужную страницу
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });

    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = 'Произошла ошибка при входе';
      if (err.status === 401) {
        errorMessage = 'Неверный email или пароль';
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast({
        title: 'Ошибка входа',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} w="100%">
        <Stack align="center">
          <Heading fontSize="4xl" textAlign="center">
            Вход в аккаунт
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Войдите, чтобы продолжить
          </Text>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register('email')}
                  autoComplete="username"
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Пароль</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    autoComplete="current-password"
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Вход..."
                >
                  Войти
                </Button>
              </Stack>
              
              <Stack pt={6}>
                <Text align="center">
                  Нет аккаунта?{' '}
                  <Link as={RouterLink} to="/register" color="blue.400">
                    Зарегистрируйтесь
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
