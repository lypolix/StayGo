import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useLoginMutation } from '../api';
import { setCredentials } from '../authSlice';
import { useAppDispatch } from '@/app/hooks';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    remember: z.boolean().optional().default(false), // 👈 optional on input, boolean after parse
});
  

type LoginFormInput  = z.input<typeof loginSchema>;  // { email: string; password: string; remember?: boolean }
type LoginFormValues = z.output<typeof loginSchema>; // { email: string; password: string; remember: boolean }


export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput, any, LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false }, // keeps the checkbox controlled
  });
  

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const { token } = await login({ email: data.email, password: data.password }).unwrap();
    dispatch(setCredentials({ token, remember: data.remember }));
    navigate(from, { replace: true });
    toast({ title: 'Login successful', status: 'success', duration: 3000, isClosable: true });
  };

  return (
    <Stack spacing={8} maxW="md" mx="auto" py={12} px={6}>
      <Stack align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Sign in to your account
        </Text>
        <Text color="gray.600">
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="brand.500">
            Sign up
          </Link>
        </Text>
      </Stack>
      <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                {...register('email')}
                placeholder="Enter your email"
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            
            <FormControl id="password" isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter your password"
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
            
            <Stack spacing={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align="start"
                justify="space-between"
              >
                <Box display="flex" alignItems="center">
                  <input
                    type="checkbox"
                    id="remember"
                    {...register('remember')}
                    className="mr-2"
                  />
                  <label htmlFor="remember">Remember me</label>
                </Box>
                <Link as={RouterLink} to="/forgot-password" color="brand.500">
                  Forgot password?
                </Link>
              </Stack>
              
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
};

export default LoginPage;
