import { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Divider, 
  Badge, 
  Collapse, 
  useDisclosure, 
  Flex, 
  Icon, 
  SimpleGrid,
  useBreakpointValue,
  Image,
  Heading,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FaBed, FaRuler, FaUsers, FaWifi, FaTv, FaUtensils, FaSwimmingPool, FaSnowflake, FaWineGlassAlt } from 'react-icons/fa';
import type { Room } from '@/shared/types';
import { formatCurrency } from '@/utils/formatters';
import type { BoxProps } from '@chakra-ui/react';

interface RoomCardProps extends BoxProps {
  room: Room;
  isSelected: boolean;
  onSelect: () => void;
  onBookNow: (roomId: string) => void;
  isAuthenticated: boolean;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  guestCount?: number;
}

export const RoomCard = ({
  room,
  isSelected,
  onSelect,
  onBookNow,
  isAuthenticated,
  checkInDate,
  checkOutDate,
  guestCount = 1,
  ...props
}: RoomCardProps) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const availableRooms = room.availableRooms || 0;
  const isAvailable = availableRooms > 0;
  
  const roomAmenities = [
    { icon: FaBed, label: `${room.bedType} bed` },
    { icon: FaRuler, label: room.size },
    { icon: FaUsers, label: `Up to ${room.maxOccupancy} guests` },
    ...(room.amenities?.includes('wifi') ? [{ icon: FaWifi, label: 'Free WiFi' }] : []),
    ...(room.amenities?.includes('tv') ? [{ icon: FaTv, label: 'TV' }] : []),
    ...(room.amenities?.includes('ac') ? [{ icon: FaSnowflake, label: 'Air Conditioning' }] : []),
    ...(room.amenities?.includes('minibar') ? [{ icon: FaWineGlassAlt, label: 'Minibar' }] : []),
  ];

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookNow(room.id);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      bg="white"
      boxShadow={isSelected ? '0 0 0 1px #3182ce' : 'sm'}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onSelect}
      _hover={{
        borderColor: isSelected ? 'blue.500' : 'gray.300',
        boxShadow: isSelected ? '0 0 0 1px #3182ce' : 'md',
      }}
      {...props}
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        {/* Room Image */}
        <Box 
          width={{ base: '100%', md: '300px' }} 
          height={{ base: '200px', md: 'auto' }}
          flexShrink={0}
          position="relative"
          overflow="hidden"
        >
          <Image
            src={room.images?.[0]?.url || '/placeholder-room.jpg'}
            alt={room.images?.[0]?.alt || 'Room image'}
            width="100%"
            height="100%"
            objectFit="cover"
            transition="transform 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
          />
          {!isAvailable && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
              fontSize="lg"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Sold Out
            </Box>
          )}
          {room.isFavorite && (
            <Badge 
              position="absolute" 
              top={2} 
              right={2} 
              colorScheme="red"
              borderRadius="full"
              px={2}
              py={1}
            >
              Favorite
            </Badge>
          )}
          <Badge 
            position="absolute" 
            bottom={2} 
            right={2} 
            colorScheme="blue"
            borderRadius="full"
            px={2}
            py={1}
          >
            {room.images?.length || 0} photos
          </Badge>
        </Box>

        {/* Room Details */}
        <Flex flex={1} direction="column" p={{ base: 4, md: 6 }}>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" mb={4}>
            <Box>
              <Heading size="md" mb={1}>
                {room.name}
              </Heading>
              <Text color="gray.600" mb={2} noOfLines={2}>
                {room.description}
              </Text>
              
              {/* Room features */}
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={2} mt={3}>
                {roomAmenities.slice(0, isMobile ? 2 : 4).map((amenity, index) => (
                  <HStack key={index} spacing={2}>
                    <Icon as={amenity.icon} color="blue.500" />
                    <Text fontSize="sm" color="gray.600">
                      {amenity.label}
                    </Text>
                  </HStack>
                ))}
                {roomAmenities.length > (isMobile ? 2 : 4) && (
                  <Text color="blue.500" fontSize="sm" fontWeight="medium">
                    +{roomAmenities.length - (isMobile ? 2 : 4)} more
                  </Text>
                )}
              </SimpleGrid>
            </Box>

            {/* Price and Book Now */}
            <VStack 
              align={{ base: 'flex-start', md: 'flex-end' }} 
              spacing={2}
              mt={{ base: 4, md: 0 }}
              ml={{ base: 0, md: 4 }}
              minWidth={{ base: '100%', md: '200px' }}
            >
              <VStack align={{ base: 'flex-start', md: 'flex-end' }} spacing={0}>
                <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                  {room.originalPrice && formatCurrency(room.originalPrice)}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  {formatCurrency(room.pricePerNight)}
                </Text>
                <Text fontSize="sm" color="gray.600">per night</Text>
                <Text fontSize="sm" color="green.600" fontWeight="medium">
                  {room.discountPercent && `Save ${room.discountPercent}%`}
                </Text>
              </VStack>
              
              {isAvailable ? (
                <Button
                  colorScheme="blue"
                  size="md"
                  width="full"
                  mt={2}
                  onClick={handleBookNow}
                  isDisabled={!isAvailable}
                >
                  {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
                </Button>
              ) : (
                <Text color="red.500" fontSize="sm" fontWeight="medium">
                  Not available for selected dates
                </Text>
              )}
              
              {availableRooms > 0 && availableRooms < 5 && (
                <Text color="orange.500" fontSize="sm" fontWeight="medium">
                  Only {availableRooms} {availableRooms === 1 ? 'room' : 'rooms'} left!
                </Text>
              )}
            </VStack>
          </Flex>

          {/* Toggle more details */}
          <Box mt="auto" pt={4} borderTopWidth="1px" borderTopColor="gray.100">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              px={0}
              _hover={{ bg: 'transparent', color: 'blue.500' }}
            >
              {isOpen ? 'Show less' : 'Show more details'}
            </Button>
          </Box>
        </Flex>
      </Flex>

      {/* Collapsible content */}
      <Collapse in={isOpen} animateOpacity>
        <Box p={6} pt={0} borderTopWidth="1px" borderTopColor="gray.100">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Room amenities */}
            <Box>
              <Heading size="sm" mb={3} color="gray.700">Room Amenities</Heading>
              <SimpleGrid columns={1} spacing={2}>
                {roomAmenities.map((amenity, index) => (
                  <HStack key={index} spacing={3}>
                    <Icon as={amenity.icon} color="blue.500" />
                    <Text fontSize="sm" color="gray.600">
                      {amenity.label}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>

            {/* Cancellation policy */}
            <Box>
              <Heading size="sm" mb={3} color="gray.700">Cancellation Policy</Heading>
              <VStack align="start" spacing={2}>
                <HStack spacing={2} color="green.600">
                  <Box as="span" fontSize="lg">✓</Box>
                  <Text fontSize="sm">Free cancellation until {room.freeCancellationBefore} days before check-in</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  After that, {room.cancellationPolicy || 'no refund will be provided for cancellations.'}
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Special offers */}
          {room.specialOffers && room.specialOffers.length > 0 && (
            <Box mt={6}>
              <Heading size="sm" mb={3} color="gray.700">Special Offers</Heading>
              <VStack align="stretch" spacing={3}>
                {room.specialOffers.map((offer, index) => (
                  <Box 
                    key={index} 
                    p={3} 
                    bg="blue.50" 
                    borderRadius="md"
                    borderLeftWidth="3px"
                    borderLeftColor="blue.500"
                  >
                    <Text fontWeight="medium" color="blue.700">{offer.title}</Text>
                    <Text fontSize="sm" color="blue.600">{offer.description}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default RoomCard;
