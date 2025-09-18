// Компонент карточки отеля, используемый в списках поиска и боковых панелях. Поддерживает горизонтальный и вертикальный вид.

import { Box, Button, Flex, Heading, Image, Text, HStack, Icon, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaSnowflake, FaTv, FaCoffee } from 'react-icons/fa';
import type { Hotel } from '../types';
import type { FavoriteHotel } from '@/features/user/types';

interface HotelCardProps {
  hotel: Hotel | FavoriteHotel;
  onClick?: () => void;
  variant?: 'horizontal' | 'vertical';
  onRemove?: () => void;
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

export const HotelCard = ({ hotel, onClick, variant = 'horizontal', onRemove }: HotelCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // Форматирование цены с валютой и за ночь
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Проверка типа отеля
  const isFavoriteHotel = (hotel: Hotel | FavoriteHotel): hotel is FavoriteHotel => {
    return 'location' in hotel && typeof hotel.location === 'string';
  };

  const price: number | null =
    typeof (hotel as any).price === 'number' ? (hotel as any).price : null;

  // Получение URL первой изображения
  const imageUrl = isFavoriteHotel(hotel) ? hotel.image : hotel.images?.[0]?.url || '';
  
  // Получение удобств, если есть
  const amenities = hotel.amenities || [];
  const displayedAmenities = amenities.slice(0, 3);
  const hasMoreAmenities = amenities.length > 3;
  
  // Получение локации
  const location = isFavoriteHotel(hotel) 
    ? hotel.location 
    : hotel.address 
      ? `${hotel.address}` 
      : 'Unknown location';
      
  // Получение рейтинга
  const starRating = isFavoriteHotel(hotel) ? hotel.starRating : (hotel.rating ?? 0);

  if (variant === 'vertical') {
    return (
      <Box
        bg={cardBg}
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
        _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        transition="all 0.2s"
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
        position="relative"
      >
        {onRemove && (
          <Box position="absolute" top={2} right={2} zIndex={1}>
            <Button 
              size="sm" 
              colorScheme="red" 
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              Remove
            </Button>
          </Box>
        )}
        
        <Image 
          src={imageUrl} 
          alt={hotel.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        
        <Box p={4}>
          <Flex justify="space-between" align="flex-start" mb={2}>
            <Heading size="md" noOfLines={1}>
              {hotel.name}
            </Heading>
            <Flex align="center">
              <StarIcon color="yellow.400" mr={1} />
              <Text>{starRating?.toFixed(1)}</Text>
            </Flex>
          </Flex>
          
          <Flex align="center" color="gray.500" mb={3}>
            <Icon as={FaMapMarkerAlt} mr={1} />
            <Text fontSize="sm" noOfLines={1}>
              {location}
            </Text>
          </Flex>
          
          <HStack spacing={2} mb={3} flexWrap="wrap">
            {displayedAmenities.map((amenity, index) => {
              const iconKey = Object.keys(amenitiesIcons).find(key => 
                amenity.toLowerCase().includes(key)
              ) as keyof typeof amenitiesIcons | undefined;
              
              if (!iconKey) return null;
              
              const { icon: AmenityIcon, label } = amenitiesIcons[iconKey];
              
              return (
                <Tooltip key={index} label={label} aria-label={label}>
                  <span>
                    <Icon as={AmenityIcon} boxSize={4} color="blue.400" />
                  </span>
                </Tooltip>
              );
            })}
            {hasMoreAmenities && (
              <Text fontSize="xs" color="gray.500">
                и еще +{amenities.length - 3}
              </Text>
            )}
          </HStack>
          
          <Flex justify="space-between" align="center" mt={4}>
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {price != null ? formatPrice(price) : 'Цена по запросу'}
              </Text>
            </Box>
            <Button colorScheme="blue" size="sm" onClick={onClick}>
              Подробнее
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  }
  
  // Горизонтальный layout
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      position="relative"
    >
      {onRemove && (
        <Box position="absolute" top={2} right={2} zIndex={1}>
          <Button 
            size="sm" 
            colorScheme="red" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </Button>
        </Box>
      )}
      
      <Box flexShrink={0} width={{ base: '100%', md: '200px' }} height={{ base: '160px', md: 'auto' }}>
        <Image
          src={imageUrl}
          alt={hotel.name}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      
      <Flex direction="column" p={4} flex={1}>
        <Flex justify="space-between" mb={2}>
          <Heading size="md" noOfLines={1}>
            {hotel.name}
          </Heading>
          <Flex align="center">
            <StarIcon color="yellow.400" mr={1} />
            <Text>{starRating.toFixed(1)}</Text>
          </Flex>
        </Flex>
        
        <Flex align="center" color="gray.500" mb={2}>
          <Icon as={FaMapMarkerAlt} mr={1} />
          <Text fontSize="sm" noOfLines={1}>
            {location}
          </Text>
        </Flex>
        
        <Text fontSize="sm" noOfLines={2} mb={3} color="gray.600">
          {'description' in hotel ? hotel.description : ''}
        </Text>
        
        <HStack spacing={2} mb={3} flexWrap="wrap">
          {displayedAmenities.map((amenity, index) => {
            const iconKey = Object.keys(amenitiesIcons).find(key => 
              amenity.toLowerCase().includes(key)
            ) as keyof typeof amenitiesIcons | undefined;
            
            if (!iconKey) return null;
            
            const { icon: AmenityIcon, label } = amenitiesIcons[iconKey];
            
            return (
              <Tooltip key={index} label={label} aria-label={label}>
                <span>
                  <Icon as={AmenityIcon} boxSize={4} color="blue.400" />
                </span>
              </Tooltip>
            );
          })}
          {hasMoreAmenities && (
            <Text fontSize="xs" color="gray.500">
              +{amenities.length - 3} more
            </Text>
          )}
        </HStack>
        
        <Flex mt="auto" justify="space-between" align="center">
          <Box>
            <Text fontSize="sm" color="gray.500">От</Text>
            <Text fontWeight="bold" fontSize="lg">
              {price != null ? formatPrice(price) : 'Цена по запросу'}
            </Text>
          </Box>
          <Button colorScheme="blue" size="sm" onClick={onClick}>
            Подробнее
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HotelCard;
