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
//import { selectCurrentUser } from '@/features/auth/authSlice';
import { HotelCard } from '@/features/hotels/components/HotelCard';
import { useGetFavoriteHotelsQuery, useUpdateProfileMutation } from '@/app/api/userApi';
import { useRemoveFromFavoritesMutation } from '@/app/api/favoriteApi';
import type { UpdateProfileData, FavoriteHotel } from '@/features/user/types';

export const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState(0);
  //const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: favorites = [], refetch } = useGetFavoriteHotelsQuery();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const toast = useToast();
  const navigate = useNavigate();

  // Инициализация данных формы при наличии данных пользователя
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
    
    // Обработка вложенных полей адреса
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
        title: 'Профиль успешно обновлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Не удалось обновить профиль',
        description: 'Пожалуйста, попробуйте позже',
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
            Зарегистрирован {memberSince}
          </Badge>
        </VStack>
      </VStack>

      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)} variant="enclosed">
        <TabList mb={6} overflowX="auto" overflowY="hidden">
          <Tab>Личная информация</Tab>
          <Tab>Мои избранные отели ({favorites.length})</Tab>
          <Tab>Бронирования</Tab>
          <Tab>Настройки</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <VStack align="start" spacing={6} maxW="2xl">
              <Box w="100%" p={6} borderWidth="1px" borderRadius="lg">
                <Heading size="md" mb={6}>Личная информация</Heading>
                <VStack spacing={4} align="start">
                  <Box w="100%">
                    <Text fontWeight="bold" mb={1} color="gray.600">Полное имя</Text>
                    <Text fontSize="lg">{user.name}</Text>
                  </Box>
                  <Box w="100%">
                    <Text fontWeight="bold" mb={1} color="gray.600">Email</Text>
                    <Text fontSize="lg">{user.email}</Text>
                  </Box>
                  {user.phone && (
                    <Box w="100%">
                      <Text fontWeight="bold" mb={1} color="gray.600">Телефон</Text>
                      <Text fontSize="lg">{user.phone}</Text>
                    </Box>
                  )}
                  {user.address && (
                    <Box w="100%">
                      <Text fontWeight="bold" mb={2} color="gray.600">Адрес</Text>
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
                    Редактировать профиль
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel px={0}>
            <Box>
              <Heading size="md" mb={6}>Мои избранные отели</Heading>
              <Divider mb={6} />
              
              {favorites.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {favorites.map((hotel) => {
                    const location = hotel.address 
                      ? `${hotel.address.city || ''}${hotel.address.city && hotel.address.country ? ', ' : ''}${hotel.address.country || ''}`
                      : '';
                    const favoriteHotel: FavoriteHotel = {
                      id: hotel.id,
                      name: hotel.name,
                      description: hotel.description,
                      image: hotel.image || '',
                      isFavorite: true,
                      location,
                      rating: Math.min(5, Math.max(1, Math.round(hotel.starRating))),
                      starRating: Math.min(5, Math.max(1, Math.round(hotel.starRating))) as 1 | 2 | 3 | 4 | 5,
                      price: hotel.price,
                      amenities: hotel.amenities,
                      address: {
                        street: '',
                        city: hotel.address?.city || '',
                        state: '',
                        country: hotel.address?.country || '',
                        zipCode: '',
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
                    Вы пока не добавили отели в избранное.
                  </Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => navigate('/hotels')}
                    leftIcon={<StarIcon />}
                  >
                    Перейти к отелям
                  </Button>
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={6} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Бронирования</Heading>
              <Text color="gray.500">Ваши будущие и прошлые бронирования будут отображаться здесь.</Text>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={6} borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Настройки аккаунта</Heading>
              <Text color="gray.500">Управление настройками аккаунта и безопасностью.</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактировать профиль</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Полное имя</FormLabel>
                <Input 
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Полное имя"
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
                <FormLabel>Телефон</FormLabel>
                <Input 
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Телефон"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Дата рождения</FormLabel>
                <Input 
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Улица</FormLabel>
                <Input 
                  name="address.street"
                  value={formData.address?.street || ''}
                  onChange={handleInputChange}
                  placeholder="Улица"
                />
              </FormControl>

              <HStack w="100%" spacing={4}>
                <FormControl>
                  <FormLabel>Город</FormLabel>
                  <Input 
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleInputChange}
                    placeholder="Город"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Область</FormLabel>
                  <Input 
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleInputChange}
                    placeholder="Область"
                  />
                </FormControl>
              </HStack>

              <HStack w="100%" spacing={4}>
                <FormControl>
                  <FormLabel>Почтовый индекс</FormLabel>
                  <Input 
                    name="address.zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={handleInputChange}
                    placeholder="Почтовый индекс"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Страна</FormLabel>
                  <Input 
                    name="address.country"
                    value={formData.address?.country || ''}
                    onChange={handleInputChange}
                    placeholder="Страна"
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
              Сохранить изменения
            </Button>
            <Button onClick={onClose} isDisabled={isUpdating}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
