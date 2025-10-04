// Будет дорабатываться

import { VStack, HStack, Text, Box, Divider, Avatar, Badge, useBreakpointValue } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import type { Review } from '@/shared/types';
import { formatDate } from '@/utils/formatters';

interface ReviewListProps {
  reviews: Review[];
  maxItems?: number;
  showHeader?: boolean;
  showDivider?: boolean;
}

export const ReviewList = ({
  reviews = [],
  maxItems,
  showHeader = true,
  showDivider = true,
}: ReviewListProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const displayedReviews = maxItems ? reviews.slice(0, maxItems) : reviews;
  
  if (reviews.length === 0) {
    return (
      <Box textAlign="center" py={6} color="gray.500">
        No reviews yet. Be the first to review!
      </Box>
    );
  }

  // Средний рейтинг
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  // Группировка отзывов по рейтингу
  {/*const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.round(r.rating) === rating).length,
    percentage: (reviews.filter((r) => Math.round(r.rating) === rating).length / reviews.length) * 100,
  }));*/}

  return (
    <VStack align="stretch" spacing={6}>
      {showHeader && (
        <Box mb={4}>
          <HStack spacing={4} align="center">
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
                {averageRating.toFixed(1)}
              </Text>
              <Text fontSize="sm" color="gray.500" mt={-1}>
                out of 5
              </Text>
            </Box>
            <Box flex={1}>
              {/*[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => Math.round(r.rating) === rating).length;
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <HStack key={rating} spacing={2} alignItems="center" mb={1}>
                    <Text fontSize="sm" minW={6} textAlign="right">
                      {rating}
                    </Text>
                    <StarIcon color="yellow.400" />
                    <Box flex={1} bg="gray.100" h={2} borderRadius="full" overflow="hidden">
                      <Box 
                        bg="yellow.400" 
                        h="100%" 
                        width={`${percentage}%`}
                        borderRadius="full"
                      />
                    </Box>
                    <Text fontSize="sm" color="gray.600" minW={8} textAlign="right">
                      {count}
                    </Text>
                  </HStack>
                );
              })*/}
            </Box>
          </HStack>
        </Box>
      )}

      <VStack align="stretch" spacing={6} divider={showDivider ? <Divider /> : undefined}>
        {displayedReviews.map((review) => (
          <Box key={review.id} py={2}>
            <HStack spacing={3} align="flex-start">
              <Avatar 
                name={review.userName} 
                src={review.userAvatar} 
                size={isMobile ? 'sm' : 'md'}
              />
              <Box flex={1}>
                <HStack justify="space-between" flexWrap="wrap" mb={1}>
                  <Text fontWeight="medium">{review.userName}</Text>
                  <HStack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        color={i < Math.round(review.rating) ? 'yellow.400' : 'gray.300'} 
                        boxSize={4}
                      />
                    ))}
                  </HStack>
                </HStack>
                
                {review.stayDate && (
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Stayed in {review.stayDate}
                  </Text>
                )}
                
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {review.comment}
                </Text>
                
                {review.tripType && (
                  <HStack spacing={2} mt={2} flexWrap="wrap">
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      {review.tripType}
                    </Badge>
                    {review.roomType && (
                      <Badge colorScheme="green" variant="subtle" fontSize="xs">
                        {review.roomType}
                      </Badge>
                    )}
                  </HStack>
                )}
                
                <Text fontSize="xs" color="gray.400" mt={2}>
                  Reviewed on {formatDate(review.createdAt)}
                </Text>
                
                {review.response && (
                  <Box 
                    mt={3} 
                    p={3} 
                    bg="gray.50" 
                    borderRadius="md"
                    borderLeftWidth="2px"
                    borderLeftColor="blue.500"
                  >
                    <Text fontWeight="medium" fontSize="sm" mb={1}>
                      Response from the property
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      {review.response.message}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {review.response.respondedAt && `Responded on ${formatDate(review.response.respondedAt)}`}
                    </Text>
                  </Box>
                )}
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default ReviewList;
