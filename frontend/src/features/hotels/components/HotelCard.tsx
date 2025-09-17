// Hotel card component used in search lists and sidebars. Supports horizontal and vertical variants.

import { Box, Button, Flex, Heading, Image, Text, Badge, HStack, Icon, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaSnowflake, FaTv, FaCoffee } from 'react-icons/fa';
import type { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onClick?: () => void;
  variant?: 'horizontal' | 'vertical';
}

const amenitiesIcons = {
  wifi: { icon: FaWifi, label: 'Free WiFi' },
  pool: { icon: FaSwimmingPool, label: 'Swimming Pool' },
  parking: { icon: FaParking, label: 'Free Parking' },
  restaurant: { icon: FaUtensils, label: 'Restaurant' },
  ac: { icon: FaSnowflake, label: 'Air Conditioning' },
  tv: { icon: FaTv, label: 'TV' },
  breakfast: { icon: FaCoffee, label: 'Breakfast Included' },
} as const;

export const HotelCard = ({ hotel, onClick, variant = 'horizontal' }: HotelCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // Format price with currency and per night
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Display first 3 amenities
  const displayedAmenities = hotel.amenities.slice(0, 3);
  const hasMoreAmenities = hotel.amenities.length > 3;

  if (variant === 'vertical') {
    return (
      <Box
        bg={cardBg}
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        {/* Hotel Image */}
        <Box position="relative" h="180px" overflow="hidden">
          <Image
            src={hotel.images[0]?.url || '/placeholder-hotel.jpg'}
            alt={hotel.name}
            objectFit="cover"
            w="100%"
            h="100%"
            transition="transform 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
          />
          {/* Rating Badge */}
          <Badge
            position="absolute"
            top={3}
            right={3}
            bg="white"
            color="gray.800"
            px={2}
            py={1}
            borderRadius="full"
            display="flex"
            alignItems="center"
            boxShadow="md"
            fontSize="sm"
          >
            <StarIcon color="yellow.400" mr={1} />
            {hotel.rating}
          </Badge>
        </Box>

        {/* Hotel Info */}
        <Flex direction="column" p={4} flex={1}>
          <Heading as="h3" size="md" mb={2} noOfLines={1}>
            {hotel.name}
          </Heading>
          
          <HStack color="gray.500" mb={3} spacing={1}>
            <Icon as={FaMapMarkerAlt} boxSize={3} />
            <Text fontSize="sm" noOfLines={1}>
              {hotel.location}
            </Text>
          </HStack>
          
          <Flex mt="auto" justify="space-between" align="flex-end">
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Starting from
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="brand.500">
                {formatPrice(hotel.price)}
                <Text as="span" fontSize="sm" color="gray.500" fontWeight="normal">
                  /night
                </Text>
              </Text>
            </Box>
            
            <HStack spacing={1}>
              {displayedAmenities.map((amenity) => {
                const amenityConfig = amenitiesIcons[amenity as keyof typeof amenitiesIcons] || 
                  { icon: FaUtensils, label: amenity };
                return (
                  <Tooltip key={amenity} label={amenityConfig.label} fontSize="xs">
                    <span>
                      <Icon 
                        as={amenityConfig.icon} 
                        color="brand.500" 
                        boxSize={4} 
                      />
                    </span>
                  </Tooltip>
                );
              })}
              {hasMoreAmenities && (
                <Text fontSize="xs" color="gray.500">
                  +{hotel.amenities.length - 3}
                </Text>
              )}
            </HStack>
          </Flex>
        </Flex>
      </Box>
    );
  }

  // Default horizontal layout
  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md', bg: hoverBg }}
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
    >
      {/* Hotel Image */}
      <Box 
        w={{ base: '100%', md: '300px' }} 
        h={{ base: '200px', md: 'auto' }}
        flexShrink={0}
        position="relative"
        overflow="hidden"
      >
        <Image
          src={hotel.images[0]?.url || '/placeholder-hotel.jpg'}
          alt={hotel.name}
          objectFit="cover"
          w="100%"
          h="100%"
          transition="transform 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
        />
        {/* Rating Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          bg="white"
          color="gray.800"
          px={2}
          py={1}
          borderRadius="full"
          display="flex"
          alignItems="center"
          boxShadow="md"
          fontSize="sm"
        >
          <StarIcon color="yellow.400" mr={1} />
          {hotel.rating}
        </Badge>
      </Box>

      {/* Hotel Info */}
      <Flex p={6} flex={1} direction="column">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={2}>
          <Box flex={1} mr={4}>
            <Heading as="h3" size="lg" mb={2} noOfLines={1}>
              {hotel.name}
            </Heading>
            <HStack color="gray.500" mb={3} spacing={1}>
              <Icon as={FaMapMarkerAlt} />
              <Text fontSize="md">{hotel.location}</Text>
            </HStack>
            
            {/* Description */}
            <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
              {hotel.description || 'Experience luxury and comfort at our premium hotel with top-notch amenities and excellent service.'}
            </Text>
            
            {/* Amenities */}
            <HStack spacing={4} mb={4} flexWrap="wrap">
              {hotel.amenities.slice(0, 4).map((amenity) => {
                const amenityConfig = amenitiesIcons[amenity as keyof typeof amenitiesIcons] || 
                  { icon: FaUtensils, label: amenity };
                return (
                  <Tooltip key={amenity} label={amenityConfig.label} fontSize="xs">
                    <HStack spacing={1}>
                      <Icon as={amenityConfig.icon} color="brand.500" />
                      <Text fontSize="sm" display={{ base: 'none', sm: 'block' }}>
                        {amenityConfig.label}
                      </Text>
                    </HStack>
                  </Tooltip>
                );
              })}
              {hotel.amenities.length > 4 && (
                <Text fontSize="sm" color="gray.500">
                  +{hotel.amenities.length - 4} more
                </Text>
              )}
            </HStack>
          </Box>
          
          {/* Price and Book Now */}
          <Flex 
            direction="column" 
            align={{ base: 'flex-start', md: 'flex-end' }} 
            justify="space-between"
            minW={{ base: '100%', md: '180px' }}
            mt={{ base: 4, md: 0 }}
            pl={{ base: 0, md: 4 }}
            borderLeft={{ base: 'none', md: '1px solid' }}
            borderColor={{ base: 'transparent', md: borderColor }}
          >
            <Box textAlign={{ base: 'left', md: 'right' }} mb={4}>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Starting from
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                {formatPrice(hotel.price)}
              </Text>
              <Text fontSize="sm" color="gray.500">
                per night
              </Text>
              <Text fontSize="xs" color="green.500" mt={1}>
                Free cancellation
              </Text>
            </Box>
            
            <Button 
              colorScheme="brand" 
              size="md" 
              w="full"
              onClick={(e) => {
                e.stopPropagation();
                // Handle book now
              }}
            >
              View Deal
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HotelCard;
