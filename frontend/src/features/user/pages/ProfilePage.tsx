import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Heading, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Avatar, 
  VStack, 
  Text, 
  useToast,
  SimpleGrid,
  Divider,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  HStack,
  Badge
} from '@chakra-ui/react';
import { EditIcon, StarIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { HotelCard } from '@/features/hotels/components/HotelCard';
import { useGetFavoriteHotelsQuery, useUpdateProfileMutation } from '@/app/api/userApi';
import { useRemoveFromFavoritesMutation } from '@/app/api/favoriteApi';
import type { UserProfile, UpdateProfileData, FavoriteHotel } from '@/features/user/types';

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: favorites = [], refetch } = useGetFavoriteHotelsQuery();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const toast = useToast();
  const navigate = useNavigate();

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || {}
      });
    }
  }, [user]);

  const handleRemoveFavorite = async (hotelId: string) => {
    try {
      await removeFromFavorites({ room_id: parseInt(hotelId) }).unwrap();
      refetch();
      toast({
        title: 'Removed from favorites',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to remove from favorites',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading user data...</Text>
      </Box>
    );
  }

  const memberSince = new Date(user.createdAt || new Date().toISOString()).getFullYear();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} mb={8}>
        <Avatar size="2xl" name={user.name} src={user.avatar} />
        <VStack spacing={2}>
          <Heading size="lg">{user.name}</Heading>
          <Text color="gray.500">{user.email}</Text>
          <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
            Member since {memberSince}
          </Badge>
        </VStack>
      </VStack>

      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)} variant="enclosed">
        <TabList mb={6} overflowX="auto" overflowY="hidden">
          <Tab>Personal Info</Tab>
          <Tab>My Favorites ({favorites.length})</Tab>
          <Tab>Bookings</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <VStack align="start" spacing={6} maxW="2xl">
              <Box w="100%" p={6} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={6}>Personal Information</Heading>
                <VStack spacing={4} align="start">
                  <Box w="100%">
                    <Text fontWeight="bold" mb={1} color="gray.600">Full Name</Text>
                    <Text fontSize="lg">{user.name}</Text>
                  </Box>
                  <Box w="100%">
                    <Text fontWeight="bold" mb={1} color="gray.600">Email</Text>
                    <Text fontSize="lg">{user.email}</Text>
                  </Box>
                  {user.phone && (
                    <Box w="100%">
                      <Text fontWeight="bold" mb={1} color="gray.600">Phone</Text>
                      <Text fontSize="lg">{user.phone}</Text>
                    </Box>
                  )}
                  {user.address && (
                    <Box w="100%">
                      <Text fontWeight="bold" mb={2} color="gray.600">Address</Text>
                      <Box pl={4}>
                        <Text>{user.address.street}</Text>
                        <Text>
                          {user.address.city}
                          {user.address.country ? `, ${user.address.country}` : ''}
                          {user.address.zipCode ? ` ${user.address.zipCode}` : ''}
                        </Text>
                        {user.address.country && <Text>{user.address.country}</Text>}
                      </Box>
                    </Box>
                  )}
                  <Button 
                    leftIcon={<EditIcon />} 
                    colorScheme="blue" 
                    variant="outline"
                    onClick={onOpen}
                    mt={4}
                  >
                    Edit Profile
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel px={0}>
            <Box>
              <Heading size="md" mb={6}>My Favorite Hotels</Heading>
              <Divider mb={6} />
              
              {favorites.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {favorites.map((hotel) => {
                    // Format location string from address
                    const location = hotel.address 
                      ? `${hotel.address.city || ''}${hotel.address.city && hotel.address.country ? ', ' : ''}${hotel.address.country || ''}`
                      : '';

                    // Map the API response to the FavoriteHotel type
                    const favoriteHotel: FavoriteHotel = {
                      id: hotel.id,
                      name: hotel.name,
                      description: hotel.description,
                      image: hotel.image || '',
                      isFavorite: true,
                      location,
                      rating: Math.min(5, Math.max(1, Math.round(hotel.starRating))), // Ensure rating is between 1-5
                      starRating: Math.min(5, Math.max(1, Math.round(hotel.starRating))) as 1 | 2 | 3 | 4 | 5, // Ensure valid star rating
                      price: hotel.price,
                      amenities: hotel.amenities,
                      address: {
                        street: '', // Not provided by API
                        city: hotel.address?.city || '',
                        state: '', // Not provided by API
                        country: hotel.address?.country || '',
                        zipCode: '', // Not provided by API
                      }
                    };

                    return (
                      <HotelCard 
                        key={hotel.id}
                        hotel={favoriteHotel}
                        variant="vertical"
                        onRemove={() => handleRemoveFavorite(hotel.id)}
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                      />
                    );
                  })}
                </SimpleGrid>
              ) : (
                <Box 
                  textAlign="center" 
                  py={12} 
                  borderWidth="1px" 
                  borderRadius="lg"
                  borderStyle="dashed"
                  borderColor="gray.200"
                >
                  <Text color="gray.500" fontSize="lg" mb={4}>
                    You haven't added any hotels to your favorites yet.
                  </Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => navigate('/hotels')}
                    leftIcon={<StarIcon />}
                  >
                    Explore Hotels
                  </Button>
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={6} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Your Bookings</Heading>
              <Text color="gray.500">Your upcoming and past bookings will appear here.</Text>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={6} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Account Settings</Heading>
              <Text color="gray.500">Manage your account preferences and security settings.</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input 
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input 
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input 
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Date of Birth</FormLabel>
                <Input 
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Street Address</FormLabel>
                <Input 
                  name="address.street"
                  value={formData.address?.street || ''}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                />
              </FormControl>

              <HStack w="100%" spacing={4}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input 
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>State/Province</FormLabel>
                  <Input 
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleInputChange}
                    placeholder="State/Province"
                  />
                </FormControl>
              </HStack>

              <HStack w="100%" spacing={4}>
                <FormControl>
                  <FormLabel>Postal Code</FormLabel>
                  <Input 
                    name="address.zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input 
                    name="address.country"
                    value={formData.address?.country || ''}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSaveProfile}
              isLoading={isUpdating}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
            <Button onClick={onClose} isDisabled={isUpdating}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
