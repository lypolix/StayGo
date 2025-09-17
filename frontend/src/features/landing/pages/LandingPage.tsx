import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  SimpleGrid,
  Image,
  Badge,
  Icon,
  VStack,
  HStack,
  Link,
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaBed, FaWifi, FaParking, FaSwimmingPool } from 'react-icons/fa';
import { FaStar, FaQuoteLeft, FaShareAlt, FaRegHeart, FaRegUser, FaRegClock } from 'react-icons/fa';

// Mock data for featured hotels
const featuredHotels = [
  {
    id: 1,
    name: 'Luxury Beach Resort',
    location: 'Maldives',
    price: 299,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['pool', 'wifi', 'parking'],
  },
  {
    id: 2,
    name: 'Mountain View Lodge',
    location: 'Swiss Alps',
    price: 199,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['wifi', 'parking'],
  },
  {
    id: 3,
    name: 'City Center Hotel',
    location: 'New York',
    price: 249,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1582719471384-894e8d422a66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['wifi', 'gym', 'restaurant'],
  },
];

const amenitiesIcons = {
  wifi: FaWifi,
  parking: FaParking,
  pool: FaSwimmingPool,
  gym: FaBed, // Using bed as a placeholder for gym
  restaurant: FaBed, // Using bed as a placeholder for restaurant
};

const testimonials = [
  {
    id: 1,
    name: 'Alex Petrov',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'The personalized recommendations were spot on! Found a hidden gem I would have never discovered otherwise.',
    source: 'TripAdvisor'
  },
  {
    id: 2,
    name: 'Maria Ivanova',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Loved how easy it was to connect with other travelers and get real, honest reviews.',
    source: 'Google'
  },
  {
    id: 3,
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 4,
    text: 'The social proof from other travelers helped me make the best choice for my family vacation.',
    source: 'Trustpilot'
  }
];

const personalizationFeatures = [
  {
    icon: <FaRegUser size={24} />,
    title: 'Personalized Matches',
    description: 'Get hotel recommendations tailored to your preferences and travel history'
  },
  {
    icon: <FaRegHeart size={24} />,
    title: 'Verified Reviews',
    description: 'Read genuine reviews from travelers who share your interests'
  },
  {
    icon: <FaRegClock size={24} />,
    title: 'Time-Saving',
    description: 'Spend less time searching and more time enjoying your trip'
  }
];

export const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgImage="url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        h={{ base: '70vh', md: '80vh' }}
        position="relative"
      >
        {/* Auth Buttons */}
        <Flex justify="flex-end" p={4} position="absolute" top={0} right={0} left={0} zIndex={1}>
          <HStack spacing={4}>
            <Button 
              as={RouterLink} 
              to="/login" 
              colorScheme="whiteAlpha" 
              variant="outline"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Sign In
            </Button>
            <Button 
              as={RouterLink} 
              to="/register" 
              colorScheme="whiteAlpha" 
              bg="whiteAlpha.200"
              _hover={{ bg: 'whiteAlpha.300' }}
            >
              Sign Up
            </Button>
          </HStack>
        </Flex>

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
        >
          <Container maxW="container.lg" px={4}>
            <Stack spacing={8} textAlign="center" color="white">
              <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="bold" lineHeight={1.2}>
                Your Perfect Stay,<br />
                <Box as="span" color="brand.200">Personalized for You</Box>
              </Heading>
              <Text fontSize="xl" maxW="2xl" mx="auto">
                Discover hotels that match your unique travel style with verified reviews from travelers like you
              </Text>
              
              <Box as="form" onSubmit={handleSearch} maxW="2xl" mx="auto" w="100%">
                <InputGroup size="lg" bg="white" borderRadius="lg" overflow="hidden">
                  <InputLeftElement pointerEvents="none" h="full" pl={4}>
                    <SearchIcon color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Where are you going?"
                    border="none"
                    _focus={{ outline: 'none' }}
                    fontSize={{ base: 'md', md: 'lg' }}
                    h="full"
                    pl={12}
                    color="gray.800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    borderRadius="0"
                    px={8}
                    h="full"
                    _hover={{ bg: 'brand.600' }}
                  >
                    Find My Stay
                  </Button>
                </InputGroup>
                <HStack mt={4} justify="center" spacing={6} flexWrap="wrap">
                  <HStack spacing={2}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} color="#ECC94B" />
                    ))}
                    <Text>4.8/5 from 10,000+ reviews</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <FaShareAlt />
                    <Text>Share with friends</Text>
                  </HStack>
                </HStack>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Personalization Features */}
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <Box textAlign="center" mb={16}>
            <Text color="brand.500" fontWeight="bold" mb={2}>
              PERSONALIZED EXPERIENCE
            </Text>
            <Heading size="xl" mb={4}>
              Tailored Just For You
            </Heading>
            <Text color="gray.600" maxW="2xl" mx="auto">
              We use smart algorithms and real traveler data to match you with hotels that fit your unique preferences.
            </Text>
          </Box>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {personalizationFeatures.map((feature, index) => (
              <VStack
                key={index}
                p={8}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.100"
                spacing={4}
                textAlign="center"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg',
                  transition: 'all 0.3s',
                }}
              >
                <Box p={3} bg="brand.50" borderRadius="full" color="brand.500">
                  {feature.icon}
                </Box>
                <Heading size="md">{feature.title}</Heading>
                <Text color="gray.600">{feature.description}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <Box textAlign="center" mb={12}>
            <Text color="brand.500" fontWeight="bold" mb={2}>
              TRAVELER REVIEWS
            </Text>
            <Heading size="xl" mb={4}>
              Loved by Travelers Worldwide
            </Heading>
          </Box>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {testimonials.map((testimonial) => (
              <Box
                key={testimonial.id}
                bg="white"
                p={8}
                borderRadius="lg"
                boxShadow="sm"
                position="relative"
              >
                <Box color="yellow.400" mb={4}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{
                        display: 'inline-block',
                        marginRight: 2,
                        opacity: i < testimonial.rating ? 1 : 0.3,
                      }}
                    />
                  ))}
                </Box>
                <Text mb={6} fontStyle="italic" position="relative">
                  <FaQuoteLeft style={{ opacity: 0.1, position: 'absolute', left: -10, top: -5 }} size={24} />
                  {testimonial.text}
                </Text>
                <Flex align="center">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    borderRadius="full"
                    boxSize="50px"
                    mr={4}
                  />
                  <Box>
                    <Text fontWeight="bold">{testimonial.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Verified Stay • {testimonial.source}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Social Proof Section */}
      <Box py={16} bg="white">
        <Container maxW="7xl" textAlign="center">
          <Text color="brand.500" fontWeight="bold" mb={2}>
            JOIN OUR COMMUNITY
          </Text>
          <Heading size="xl" mb={8}>
            Connect With Fellow Travelers
          </Heading>
          
          <HStack spacing={8} justify="center" mb={8} flexWrap="wrap">
            {['#TravelTuesday', '#Wanderlust', '#HotelHacks', '#TravelTips'].map((tag) => (
              <Badge
                key={tag}
                px={4}
                py={2}
                borderRadius="full"
                colorScheme="brand"
                variant="subtle"
                fontSize="md"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
          
          <Button
            colorScheme="brand"
            size="lg"
            leftIcon={<FaShareAlt />}
            onClick={() => alert('Share your travel experience!')}
          >
            Share Your Story
          </Button>
        </Container>
      </Box>

      {/* Featured Hotels */}
      <Container maxW="container.xl" py={16}>
        <Stack spacing={12}>
          <Box textAlign="center">
            <Text fontSize="sm" color="brand.500" fontWeight="semibold" mb={2}>
              PERSONALIZED FOR YOU
            </Text>
            <Heading as="h2" size="xl" mb={4}>
              Recommended Just For You
            </Heading>
            <Text color="gray.600" maxW="2xl" mx="auto">
              Based on your preferences and travelers like you
            </Text>
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={8}
            px={{ base: 4, md: 0 }}
          >
            {featuredHotels.map((hotel) => (
              <Box
                key={hotel.id}
                bg="white"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                cursor="pointer"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
              >
                <Box h="200px" overflow="hidden" position="relative">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    objectFit="cover"
                    w="full"
                    h="full"
                  />
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    bg="white"
                    color="gray.800"
                    px={3}
                    py={1}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    boxShadow="md"
                  >
                    <StarIcon color="yellow.400" mr={1} />
                    {hotel.rating}
                  </Badge>
                </Box>
                <Box p={6}>
                  <HStack justify="space-between" mb={2}>
                    <Heading as="h3" size="md" noOfLines={1}>
                      {hotel.name}
                    </Heading>
                    <Text fontWeight="bold" color="brand.500">
                      ${hotel.price}
                      <Text as="span" color="gray.500" fontSize="sm" fontWeight="normal">
                        /night
                      </Text>
                    </Text>
                  </HStack>
                  <HStack color="gray.500" mb={4} spacing={1}>
                    <Icon as={FaMapMarkerAlt} />
                    <Text fontSize="sm">{hotel.location}</Text>
                  </HStack>
                  <HStack spacing={4}>
                    {hotel.amenities.map((amenity) => (
                      <Icon
                        key={amenity}
                        as={amenitiesIcons[amenity as keyof typeof amenitiesIcons] || FaBed}
                        color="brand.500"
                        title={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                      />
                    ))}
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>

          <Box textAlign="center" mt={4}>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => navigate('/search')}
              px={8}
            >
              View All Hotels
            </Button>
          </Box>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.800')} py={20}>
        <Container maxW="container.lg">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {[
              {
                title: 'Best Price Guarantee',
                description:
                  'We guarantee the best prices for your next stay. Found a better deal? We’ll match it!',
                icon: '🏷️',
              },
              {
                title: '24/7 Customer Support',
                description:
                  'Our dedicated support team is available around the clock to assist you with any queries.',
                icon: '📞',
              },
              {
                title: 'Easy Booking',
                description:
                  'Simple and secure booking process. Your perfect stay is just a few clicks away!',
                icon: '✅',
              },
            ].map((feature, index) => (
              <VStack
                key={index}
                p={6}
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                textAlign="center"
                spacing={4}
              >
                <Text fontSize="4xl">{feature.icon}</Text>
                <Heading as="h3" size="md">
                  {feature.title}
                </Heading>
                <Text color="gray.600">{feature.description}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
