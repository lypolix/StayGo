// Будет дорабатываться

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Input,
  AspectRatio,
  TabList,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaWifi } from 'react-icons/fa';
import { useGetHotelByIdQuery, useGetSimilarHotelsQuery } from '../api';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '@/app/api/favoriteApi';
import { HotelCard } from '../components/HotelCard';
import { Rating } from '@/shared/components/Rating';
import type { HotelDetails, RoomTypeUI, ReviewUI } from '../types';

export const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  //const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue('white', 'gray.800');
  //const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { data: rawHotel, isLoading, isError } = useGetHotelByIdQuery(id || '');
  const hotel = rawHotel as HotelDetails | undefined;

  const amenities = useMemo(() => hotel?.amenities ?? [], [hotel?.amenities]);
  const roomTypes = useMemo(() => hotel?.roomTypes ?? [], [hotel?.roomTypes]);
  const reviews = useMemo(() => hotel?.reviews ?? [], [hotel?.reviews]);

  const { data: similarHotels } = useGetSimilarHotelsQuery(
    { hotelId: id || '', limit: 4 },
    { skip: !id }
  );
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleFavoriteToggle = async () => {
    if (!id || !hotel) return;
    
    try {
      if (hotel.isFavorite) {
        await removeFromFavorites({ room_id: parseInt(id) }).unwrap();
        toast({
          title: 'Removed from favorites',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addToFavorites({ room_id: parseInt(id) }).unwrap();
        toast({
          title: 'Added to favorites',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to update favorites',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Skeleton height="400px" borderRadius="lg" />
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
            <Stack spacing={6}>
              <Skeleton height="40px" width="70%" />
              <Skeleton height="24px" width="50%" />
              <Skeleton height="100px" />
            </Stack>
            <Skeleton height="400px" borderRadius="lg" />
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (isError || !hotel) {
    return (
      <Container maxW="container.xl" py={8} textAlign="center">
        <Text fontSize="xl" mb={4}>Hotel not found</Text>
        <Button colorScheme="brand" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const mainImage = hotel.images?.[selectedImage] || hotel.images?.[0];

  return (
    <Box>
      {/* Галерея изображений */}
      <Box position="relative" height={{ base: '300px', md: '500px' }} overflow="hidden">
        <Image
          src={mainImage?.url || 'https://via.placeholder.com/1200x500?text=No+Image'}
          alt={mainImage?.alt || hotel.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
        
        {(hotel.images || []).length > 1 && (
          <>
            <IconButton
              aria-label="Previous image"
              icon={<FaChevronLeft />}
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: 'blackAlpha.700' }}
              onClick={() => setSelectedImage((prev) => (prev - 1 + (hotel.images || []).length) % (hotel.images || []).length)}
              borderRadius="full"
            />
            <IconButton
              aria-label="Next image"
              icon={<FaChevronRight />}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: 'blackAlpha.700' }}
              onClick={() => setSelectedImage((prev) => (prev + 1) % ((hotel.images || []).length))}
              borderRadius="full"
            />
          </>
        )}
        
        <IconButton
          aria-label={hotel.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          icon={hotel.isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
          position="absolute"
          top={4}
          right={4}
          bg="white"
          color="gray.800"
          _hover={{ bg: 'gray.100' }}
          onClick={handleFavoriteToggle}
          borderRadius="full"
          boxShadow="md"
        />
      </Box>
      
      <Container maxW="container.xl" py={8}>
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/search">Отели</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{hotel.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <Box>
            <Flex justify="space-between" align="flex-start" mb={6}>
              <Box>
                <Heading as="h1" size="2xl" mb={2}>
                  {hotel.name}
                </Heading>
                <HStack color="gray.600" mb={4} spacing={1}>
                  <Icon as={FaMapMarkerAlt} />
                  <Text>{hotel.city}</Text>
                </HStack>
                <Rating value={hotel.rating || 0} size="md" />
              </Box>
              <Box textAlign="right">
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  ${hotel.price}
                  <Text as="span" fontSize="md" fontWeight="normal" color="gray.500">/night</Text>
                </Text>
                <Button colorScheme="brand" mt={2} size={isMobile ? 'md' : 'lg'}>
                  Забронировать
                </Button>
              </Box>
            </Flex>
            
            <Tabs variant="enclosed" colorScheme="brand" defaultIndex={0}>
              <TabList>
                <Tab>Обзор</Tab>
                <Tab>Номера</Tab>
                <Tab>Отзывы</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="md" mb={4}>Описание</Heading>
                      <Text>{hotel.description}</Text>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={4}>Удобства</Heading>
                      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                        {amenities.slice(0, 6).map((amenity, index) => (
                          <HStack key={index} spacing={3}>
                            <Icon as={FaWifi} color="brand.500" />
                            <Text>{amenity}</Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </TabPanel>

                <TabPanel px={0}>
                  {roomTypes.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {roomTypes.map((room: RoomTypeUI) => (
                        <Box key={room.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
                          <AspectRatio ratio={16 / 9}>
                            <Image
                              src={room.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                              alt={room.name}
                              objectFit="cover"
                            />
                          </AspectRatio>
                          <Box p={4}>
                            <Heading size="md" mb={2}>{room.name}</Heading>
                            <Text color="gray.600" mb={4}>{room.description}</Text>
                            <HStack justify="space-between">
                              <VStack align="flex-start" spacing={1}>
                                <Text fontSize="sm">Максимальное количество гостей: {room.maxOccupancy}</Text>
                                <Text fontSize="sm">Доступно: {room.availableRooms} номеров</Text>
                              </VStack>
                              <Text fontSize="xl" fontWeight="bold" color="brand.500">
                                ${room.pricePerNight}
                              </Text>
                            </HStack>
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box textAlign="center" py={10}>
                      <Text color="gray.500">Свободных номеров нет.</Text>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel px={0}>
                  {reviews.length > 0 ? (
                    <VStack spacing={6} align="stretch">
                      {reviews.map((review: ReviewUI) => (
                        <Box key={review.id} borderWidth="1px" borderRadius="lg" p={4}>
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="bold">{review.userName}</Text>
                            <Rating value={review.rating} size="sm" />
                          </HStack>
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            {new Date(review.date).toLocaleDateString('en-US')}
                          </Text>
                          <Text>{review.comment}</Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.500" textAlign="center" py={10}>
                      Отзывов пока нет. Будьте первым, кто оставит отзыв!
                    </Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          
          {/* Боковая панель */}
          <Box>
            <Box 
              borderWidth="1px" 
              borderRadius="lg" 
              p={6}
              position="sticky"
              top={4}
              bg={cardBg}
              boxShadow="sm"
            >
              <Heading size="md" mb={4}>
                Забронируйте ваш номер
              </Heading>
              
              <VStack spacing={4}>
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Дата заезда</Text>
                  <Input type="date" size="md" />
                </Box>
                
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Дата выезда</Text>
                  <Input type="date" size="md" />
                </Box>
                
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Количество гостей</Text>
                  <Input type="number" defaultValue={2} min={1} size="md" />
                </Box>
                
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Количество номеров</Text>
                  <Input type="number" defaultValue={1} min={1} size="md" />
                </Box>
                
                <Button colorScheme="brand" size="lg" w="100%" mt={4}>
                  Проверить доступность
                </Button>
                
                <Text fontSize="sm" color="green.500" textAlign="center" mt={2}>
                  Отмена бронирования бесплатна
                </Text>
              </VStack>
            </Box>
            
            {similarHotels && similarHotels.length > 0 && (
              <Box mt={8}>
                <Heading size="md" mb={4}>
                  Похожие отели
                </Heading>
                <VStack spacing={4} align="stretch">
                  {similarHotels.map((hotel) => (
                    <HotelCard 
                      key={hotel.id} 
                      hotel={hotel} 
                      variant="vertical"
                      onClick={() => navigate(`/hotels/${hotel.id}`)}
                    />
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default HotelDetailPage;
