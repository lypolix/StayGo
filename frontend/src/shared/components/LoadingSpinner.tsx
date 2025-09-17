import { type SpinnerProps, Spinner } from '@chakra-ui/react';

interface LoadingSpinnerProps extends SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingSpinner = ({ size = 'md', ...props }: LoadingSpinnerProps) => {
  return (
    <Spinner
      size={size}
      color="brand.500"
      thickness="3px"
      speed="0.65s"
      emptyColor="gray.200"
      {...props}
    />
  );
};

export default LoadingSpinner;
