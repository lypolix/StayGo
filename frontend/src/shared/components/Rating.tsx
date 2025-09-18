import { HStack, Icon, Text } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const Rating = ({ value, count, size = 'md' }: RatingProps) => {
  const sizeMap = {
    sm: 4,
    md: 5,
    lg: 6,
  };

  const starSize = sizeMap[size];
  const filledStars = Math.round(value * 2) / 2; // Округление до ближайшего 0.5

  return (
    <HStack spacing={1} align="center">
      <HStack spacing={0.5}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= filledStars;
          const isHalfFilled = star - 0.5 <= filledStars && star > filledStars;
          
          return (
            <Icon
              key={star}
              as={FaStar}
              boxSize={`${starSize}`}
              color={isFilled || isHalfFilled ? 'yellow.400' : 'gray.300'}
              fill={isFilled ? 'currentColor' : 'none'}
              viewBox="0 0 20 20"
              sx={{
                ...(isHalfFilled && {
                  background: 'linear-gradient(90deg, currentColor 50%, transparent 50%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }),
              }}
            />
          );
        })}
      </HStack>
      {count !== undefined && (
        <Text fontSize={`${starSize - 2}px`} color="gray.600">
          ({count})
        </Text>
      )}
    </HStack>
  );
};
