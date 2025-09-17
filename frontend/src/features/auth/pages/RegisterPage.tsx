import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  FormHelperText,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRegisterMutation } from '../api';
import { setCredentials } from '../authSlice';
import { useAppDispatch } from '@/app/hooks';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { token } = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(
        setCredentials({
          token,
          remember: true,
        }),
      );

      // Redirect to home after successful registration
      navigate('/', { replace: true });

      toast({
        title: 'Registration successful',
        description: 'Your account has been created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: 'An error occurred during registration',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack spacing={8} maxW="md" mx="auto" py={12} px={6}>
      <Stack align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Create your account
        </Text>
        <Text color="gray.600">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="brand.500">
            Sign in
          </Link>
        </Text>
      </Stack>
      <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <FormControl id="name" isInvalid={!!errors.name}>
              <FormLabel>Full Name</FormLabel>
              <Input type="text" {...register('name')} placeholder="John Doe" />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                {...register('email')}
                placeholder="your@email.com"
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
                  placeholder="Create a password"
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
              <FormHelperText>
                Must be at least 8 characters with uppercase, lowercase, number,
                and special character
              </FormHelperText>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Confirm your password"
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.confirmPassword && errors.confirmPassword.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.acceptTerms}>
              <Box display="flex" alignItems="flex-start">
                <Box display="flex" h={5} alignItems="center">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    {...register('acceptTerms')}
                    className="mr-2"
                  />
                </Box>
                <Box ml={2}>
                  <label htmlFor="acceptTerms" className="text-sm">
                    I agree to the{' '}
                    <Link color="brand.500" href="#">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link color="brand.500" href="#">
                      Privacy Policy
                    </Link>
                  </label>
                </Box>
              </Box>
              <FormErrorMessage>
                {errors.acceptTerms && errors.acceptTerms.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create account
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
};

export default RegisterPage;
