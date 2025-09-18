import { useState } from 'react';
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
  TabList,
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
  Avatar,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaBed } from 'react-icons/fa';
import { useGetHotelByIdQuery, useGetSimilarHotelsQuery } from '../api';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '@/app/api/favoriteApi';
import { HotelCard } from '../components/HotelCard';
import { Rating } from '@/shared/components/Rating';

export const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(id || '');
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
      {/* Image Gallery */}
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
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/search">Hotels</BreadcrumbLink>
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
                <Rating value={hotel.rating} size="md" />
              </Box>
              <Box textAlign="right">
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  ${hotel.price}
                  <Text as="span" fontSize="md" fontWeight="normal" color="gray.500">/night</Text>
                </Text>
                <Button colorScheme="brand" mt={2} size={isMobile ? 'md' : 'lg'}>
                  Book Now
                </Button>
              </Box>
            </Flex>
            
            <Tabs index={activeTab} onChange={setActiveTab} colorScheme="brand" isLazy>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Rooms</Tab>
                <Tab>Amenities</Tab>
                <Tab>Reviews</Tab>
              </TabList>
              
              <TabPanels py={6}>
                <TabPanel px={0}>
                  <Text mb={6} fontSize="lg" lineHeight="tall">
                    {hotel.description || 'No description available.'}
                  </Text>
                  
                  <Heading size="md" mb={4}>
                    Popular Amenities
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={8}>
                    {hotel.amenities.slice(0, 6).map((amenity) => (
                      <HStack key={amenity} spacing={3}>
                        <Box w="5" h="5" bg="brand.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                          <Text fontSize="xs" color="brand.600">{amenity.charAt(0).toUpperCase()}</Text>
                        </Box>
                        <Text textTransform="capitalize">{amenity}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    {hotel.roomTypes.length > 0 ? (
                      hotel.roomTypes.map((room) => (
                        <Box
                          key={room.id}
                          borderWidth="1px"
                          borderRadius="lg"
                          overflow="hidden"
                          bg={cardBg}
                        >
                          <Grid templateColumns={{ base: '1fr', md: '250px 1fr auto' }}>
                            <Box h="200px">
                              <Image
                                src={room.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={room.name}
                                objectFit="cover"
                                w="100%"
                                h="100%"
                              />
                            </Box>
                            
                            <Box p={6}>
                              <Heading as="h3" size="md" mb={2}>
                                {room.name}
                              </Heading>
                              <Text color="gray.600" mb={4} noOfLines={2}>
                                {room.description}
                              </Text>
                              <HStack spacing={4} mb={2}>
                                <HStack>
                                  <Icon as={FaBed} color="brand.500" />
                                  <Text fontSize="sm">Max {room.maxOccupancy} {room.maxOccupancy === 1 ? 'guest' : 'guests'}</Text>
                                </HStack>
                              </HStack>
                              {room.availableRooms <= 5 && room.availableRooms > 0 && (
                                <Text color="red.500" fontSize="sm" fontWeight="medium">
                                  Only {room.availableRooms} {room.availableRooms === 1 ? 'room' : 'rooms'} left!
                                </Text>
                              )}
                            </Box>
                            
                            <Flex
                              direction="column"
                              justify="space-between"
                              p={6}
                              borderLeft={{ base: 'none', md: '1px solid' }}
                              borderTop={{ base: '1px solid', md: 'none' }}
                              borderColor={borderColor}
                              minW={{ md: '180px' }}
                            >
                              <Box textAlign={{ base: 'left', md: 'right' }} mb={4}>
                                <Text fontSize="xl" fontWeight="bold" color="brand.500">
                                  ${room.pricePerNight}
                                </Text>
                                <Text fontSize="sm" color="gray.500">per night</Text>
                              </Box>
                              
                              <Button
                                colorScheme="brand"
                                size={isMobile ? 'sm' : 'md'}
                                isDisabled={room.availableRooms === 0}
                              >
                                {room.availableRooms > 0 ? 'Book Now' : 'Sold Out'}
                              </Button>
                            </Flex>
                          </Grid>
                        </Box>
                      ))
                    ) : (
                      <Box textAlign="center" py={10}>
                        <Text color="gray.500">No room types available.</Text>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
                
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {hotel.amenities.map((amenity) => (
                      <HStack key={amenity} spacing={3} align="flex-start">
                        <Box w="6" h="6" bg="brand.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                          <Text fontSize="xs" color="brand.600">{amenity.charAt(0).toUpperCase()}</Text>
                        </Box>
                        <Text textTransform="capitalize">{amenity}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    {hotel.reviews && hotel.reviews.length > 0 ? (
                      hotel.reviews.map((review) => (
                        <Box key={review.id} borderBottomWidth="1px" pb={6} _last={{ borderBottom: 'none' }}>
                          <Flex justify="space-between" mb={2}>
                            <HStack>
                              <Avatar name={review.userName} size="sm" />
                              <Box>
                                <Text fontWeight="medium">{review.userName}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {new Date(review.date).toLocaleDateString()}
                                </Text>
                              </Box>
                            </HStack>
                            <Rating value={review.rating} size="sm" />
                          </Flex>
                          <Text color="gray.700">{review.comment}</Text>
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={10}>
                        No reviews yet. Be the first to review!
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          
          {/* Sidebar */}
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
                Book Your Stay
              </Heading>
              
              <VStack spacing={4}>
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Check-in</Text>
                  <Input type="date" size="md" />
                </Box>
                
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Check-out</Text>
                  <Input type="date" size="md" />
                </Box>
                
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Guests</Text>
                  <Input type="number" defaultValue={2} min={1} size="md" />
                </Box>
                
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Rooms</Text>
                  <Input type="number" defaultValue={1} min={1} size="md" />
                </Box>
                
                <Button colorScheme="brand" size="lg" w="100%" mt={4}>
                  Check Availability
                </Button>
                
                <Text fontSize="sm" color="green.500" textAlign="center" mt={2}>
                  Free cancellation available
                </Text>
              </VStack>
            </Box>
            
            {similarHotels && similarHotels.length > 0 && (
              <Box mt={8}>
                <Heading size="md" mb={4}>
                  Similar Hotels
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
