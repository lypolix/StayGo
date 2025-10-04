// Будет дорабатываться

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { FaBed, FaWifi, FaParking, FaUtensils, FaSwimmingPool, FaTv } from 'react-icons/fa';

import {
  useGetRoomByIdQuery,
  useGetHotelByIdQuery,
  useGetReviewsByRoomIdQuery,
} from '../api';

import { useAppSelector } from '@/app/hooks';
import { formatCurrency } from '@/utils/formatters';
import { DatePicker } from '@/components/DatePicker';
import type { HotelImage } from '../types';

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Данные номера
  const { data: room, isLoading, isError, error } = useGetRoomByIdQuery(roomId || '', {
    skip: !roomId,
  });

  // Данные отеля
  const { data: hotel } = useGetHotelByIdQuery(room?.hotelId || '', {
    skip: !room?.hotelId,
  });

  // Отзывы по room_id
  const roomIdNum = (room as any)?.room_id ?? Number(roomId);
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
  } = useGetReviewsByRoomIdQuery(roomIdNum, { skip: !roomIdNum });

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Ошибка загрузки номера',
        description: (error as any)?.data?.message || 'Не удалось загрузить данные номера',
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
        title: 'Пожалуйста, выберите даты заезда и выезда',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate('/book', {
      state: {
        roomId: (room as any)?.id,
        hotelId: (room as any)?.hotelId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      },
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
      <Button leftIcon={<ArrowBackIcon />} variant="ghost" mb={4} onClick={() => navigate(-1)}>
        Назад к отелю
      </Button>

      <VStack spacing={8} align="stretch">
        {/* Шапка */}
        <VStack align="start" spacing={2}>
          <Heading as="h1" size="2xl">{room.name}</Heading>
          <Text fontSize="xl" color="gray.600">
            {hotel?.name} • {room.maxOccupancy} гостей • {room.bedType} спальное место
          </Text>
          <HStack>
            <Badge colorScheme="green" px={2} py={1} borderRadius="md">
              {room.availableRooms > 0 ? 'Доступен' : 'Недоступен'}
            </Badge>
            {room.isFavorite && (
              <Badge colorScheme="red" px={2} py={1} borderRadius="md">
                Избранное
              </Badge>
            )}
          </HStack>
        </VStack>

        {/* Галерея */}
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
                  <Badge position="absolute" top={2} right={2} colorScheme="blue">
                    {index + 1}/{room.images?.length}
                  </Badge>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          {/* Данные номера */}
          <Box flex={2}>
            <VStack spacing={6} align="start">
              {/* Описание */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>Описание номера</Heading>
                <Text>{room.description}</Text>
              </Box>

              <Divider />

              {/* Удобства */}
              <Box width="100%">
                <Heading as="h2" size="lg" mb={4}>Удобства</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {room.amenities?.map((amenity, index) => (
                    <HStack key={index}>
                      {getAmenityIcon(amenity)}
                      <Text textTransform="capitalize">
                        {amenity.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Отзывы */}
              <Box width="100%">
                <Heading as="h2" size="lg" mb={4}>Отзывы</Heading>

                {isReviewsLoading ? (
                  <Text>Загрузка отзывов…</Text>
                ) : reviews.length > 0 ? (
                  <VStack spacing={4} align="start">
                    {reviews.slice(0, 3).map((review) => (
                      <Box key={review.id} borderWidth="1px" p={4} borderRadius="md" width="100%">
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
                          Stayed on {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    ))}
                    {reviews.length > 3 && (
                      <Button variant="link" colorScheme="blue">
                        View all {reviews.length} reviews
                      </Button>
                    )}
                  </VStack>
                ) : (
                  <Text>Пока нет отзывов. Будьте первым!</Text>
                )}
              </Box>
            </VStack>
          </Box>

          {/* Блок бронирования */}
          <Box flex={1} position={{ base: 'static', lg: 'sticky' }} top={4} alignSelf="flex-start">
            <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="md" bg="white">
              <VStack spacing={6} align="stretch">
                <Heading as="h2" size="lg">
                  {formatCurrency(room.pricePerNight)}{' '}
                  <Text as="span" fontSize="md" color="gray.600">/ night</Text>
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

// Иконки удобств
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
