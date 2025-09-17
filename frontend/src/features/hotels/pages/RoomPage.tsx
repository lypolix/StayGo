import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Image, 
  VStack, 
  HStack, 
  Divider, 
  Button, 
  useToast, 
  Skeleton, 
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Flex,
  useBreakpointValue
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { FaBed, FaWifi, FaParking, FaUtensils, FaSwimmingPool, FaTv } from 'react-icons/fa';
import { useGetRoomByIdQuery, useGetHotelByIdQuery } from '../api';
import { useAppSelector } from '@/app/hooks';
import { formatCurrency } from '@/utils/formatters';
import { DatePicker } from '@/components/DatePicker';
import type { Amenity, HotelImage, Review } from '../types';

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Get the room data
  const { data: room, isLoading, isError, error } = useGetRoomByIdQuery(roomId || '', {
    skip: !roomId,
  });

  // Get the hotel data using the room's hotelId
  const { data: hotel } = useGetHotelByIdQuery(room?.hotelId || '');

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error loading room',
        description: (error as any)?.data?.message || 'Failed to load room details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    }
  }, [isError, error, navigate, toast]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${roomId}` } });
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: 'Please select check-in and check-out dates',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Navigate to booking page with room and dates
    navigate('/book', { 
      state: { 
        roomId: room?.id,
        hotelId: room?.hotelId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      } 
    });
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(room?.images?.findIndex((img) => img.url === imageUrl) || 0);
    onOpen();
  };

  if (isLoading || !room || !hotel) {
    return (
      <Box p={4} maxW="1200px" mx="auto">
        <Skeleton height="400px" mb={6} />
        <Skeleton height="200px" mb={6} />
        <Skeleton height="100px" />
      </Box>
    );
  }

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <Button 
        leftIcon={<ArrowBackIcon />} 
        variant="ghost" 
        mb={4} 
        onClick={() => navigate(-1)}
      >
        Back to hotel
      </Button>

      <VStack spacing={8} align="stretch">
        {/* Room Header */}
        <VStack align="start" spacing={2}>
          <Heading as="h1" size="2xl">{room.name}</Heading>
          <Text fontSize="xl" color="gray.600">
            {hotel?.name} • {room.maxOccupancy} guests • {room.bedType} bed
          </Text>
          <HStack>
            <Badge colorScheme="green" px={2} py={1} borderRadius="md">
              {room.availableRooms > 0 ? 'Available' : 'Sold Out'}
            </Badge>
            {room.isFavorite && (
              <Badge colorScheme="red" px={2} py={1} borderRadius="md">
                Favorite
              </Badge>
            )}
          </HStack>
        </VStack>

        {/* Room Gallery */}
        <Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {room.images?.map((img: HotelImage, index: number) => (
              <Box 
                key={index} 
                position="relative" 
                cursor="pointer"
                onClick={() => handleImageClick(img.url)}
                borderRadius="lg"
                overflow="hidden"
                height="200px"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Room image ${index + 1}`}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="transform 0.2s"
                />
                {index === 0 && (
                  <Badge 
                    position="absolute" 
                    top={2} 
                    right={2} 
                    colorScheme="blue"
                  >
                    {index + 1}/{room.images?.length}
                  </Badge>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          {/* Room Details */}
          <Box flex={2}>
            <VStack spacing={6} align="start">
              {/* Description */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>Room Description</Heading>
                <Text>{room.description}</Text>
              </Box>

              <Divider />

              {/* Amenities */}
              <Box width="100%">
                <Heading as="h2" size="lg" mb={4}>Room Amenities</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {room.amenities?.map((amenity, index) => (
                    <HStack key={index}>
                      {getAmenityIcon(amenity)}
                      <Text textTransform="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Reviews */}
              <Box width="100%">
                <Heading as="h2" size="lg" mb={4}>Reviews</Heading>
                {hotel?.reviews && hotel.reviews.length > 0 ? (
                  <VStack spacing={4} align="start">
                    {hotel.reviews.slice(0, 3).map((review: Review, index: number) => (
                      <Box key={index} borderWidth="1px" p={4} borderRadius="md" width="100%">
                        <HStack mb={2}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              color={i < review.rating ? 'yellow.400' : 'gray.300'} 
                            />
                          ))}
                        </HStack>
                        <Text fontWeight="bold">{review.userName}</Text>
                        {review.title && <Text fontWeight="semibold">{review.title}</Text>}
                        <Text>{review.comment}</Text>
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Stayed on {new Date(review.date).toLocaleDateString()}
                        </Text>
                      </Box>
                    ))}
                    {hotel?.reviews?.length > 3 && (
                      <Button variant="link" colorScheme="blue">
                        View all {hotel.reviews.length} reviews
                      </Button>
                    )}
                  </VStack>
                ) : (
                  <Text>No reviews yet. Be the first to review!</Text>
                )}
              </Box>
            </VStack>
          </Box>

          {/* Booking Card */}
          <Box 
            flex={1} 
            position={{ base: 'static', lg: 'sticky' }} 
            top={4}
            alignSelf="flex-start"
          >
            <Box 
              borderWidth="1px" 
              borderRadius="lg" 
              p={6} 
              boxShadow="md"
              bg="white"
            >
              <VStack spacing={6} align="stretch">
                <Heading as="h2" size="lg">
                  {formatCurrency(room.pricePerNight)} <Text as="span" fontSize="md" color="gray.600">/ night</Text>
                </Heading>
                
                <Divider />
                
                <VStack spacing={4} align="stretch">
                  <DatePicker.Single
                    label="Check-in"
                    selectedDate={checkInDate}
                    onChange={setCheckInDate}
                    minDate={new Date()}
                    placeholderText="Add dates"
                  />
                  
                  <DatePicker.Single
                    label="Check-out"
                    selectedDate={checkOutDate}
                    onChange={setCheckOutDate}
                    minDate={checkInDate || new Date()}
                    placeholderText="Add dates"
                    disabled={!checkInDate}
                  />
                </VStack>
                
                <Button 
                  colorScheme="blue" 
                  size="lg" 
                  width="full"
                  onClick={handleBookNow}
                  isDisabled={!room.availableRooms}
                >
                  {room.availableRooms > 0 ? 'Book Now' : 'Sold Out'}
                </Button>
                
                {room.availableRooms > 0 && (
                  <Text textAlign="center" color="green.600" fontSize="sm">
                    Only {room.availableRooms} room{room.availableRooms > 1 ? 's' : ''} left at this price!
                  </Text>
                )}
                
                <Divider />
                
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text color="gray.600">Price per night:</Text>
                    <Text>{formatCurrency(room.pricePerNight)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Taxes and fees:</Text>
                    <Text>{formatCurrency(room.pricePerNight * 0.15)}</Text>
                  </HStack>
                  <HStack justify="space-between" fontWeight="bold" pt={2} borderTopWidth="1px">
                    <Text>Total:</Text>
                    <Text>{formatCurrency(room.pricePerNight * 1.15)}</Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </VStack>

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Image 
              src={room.images?.[selectedImage].url} 
              alt="Enlarged room view" 
              width="100%" 
              objectFit="contain"
              maxH="70vh"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Helper function to get amenity icons
function getAmenityIcon(amenity: string) {
  const iconProps = { color: 'blue.500', mr: 2 };
  
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <FaWifi {...iconProps} />;
    case 'parking':
      return <FaParking {...iconProps} />;
    case 'restaurant':
      return <FaUtensils {...iconProps} />;
    case 'pool':
      return <FaSwimmingPool {...iconProps} />;
    case 'tv':
      return <FaTv {...iconProps} />;
    default:
      return <FaBed {...iconProps} />;
  }
}

export default RoomPage;
