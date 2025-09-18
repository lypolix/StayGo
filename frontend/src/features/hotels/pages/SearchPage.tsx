// Будет дорабатываться

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Icon,
  HStack,
  VStack,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import { FaFilter, FaWifi, FaSwimmingPool, FaParking, FaUtensils } from 'react-icons/fa';
import { useSearchHotelsQuery } from '../api';
import { HotelCard } from '../components/HotelCard';

// Моки удобств для фильтрации
const amenities = [
  { id: 'wifi', label: 'Бесплатный WiFi', icon: FaWifi },
  { id: 'pool', label: 'Бассейн', icon: FaSwimmingPool },
  { id: 'parking', label: 'Бесплатная парковка', icon: FaParking },
  { id: 'restaurant', label: 'Ресторан', icon: FaUtensils },
  { id: 'breakfast', label: 'Завтрак включен', icon: FaUtensils },
];

// Мок-города для фильтрации
const cities = [
  'Москва',
  'Сан-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Получить search query из URL
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  
  // Фильтры
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rating, setRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Получить отели по фильтрам
  const { data: hotels, isLoading, isError } = useSearchHotelsQuery({
    search: query,
    city: selectedCity,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating: rating,
    amenities: selectedAmenities.join(','),
  });
  
  // Обновить search query при изменении URL
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);
  
  // Обработка отправки формы поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };
  
  // Сбросить все фильтры
  const resetFilters = () => {
    setSelectedCity('');
    setPriceRange([0, 1000]);
    setRating(0);
    setSelectedAmenities([]);
  };
  
  // Переключение выбора удобства
  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };
  
  // Показать сообщение об ошибке при загрузке отелей
  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: 'Не удалось загрузить отели. Попробуйте позже.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError, toast]);
  
  return (
    <Container maxW="container.xl" py={8}>
      {/* Search Bar */}
      <Box as="form" onSubmit={handleSearch} mb={8}>
        <InputGroup size="lg" bg="white" borderRadius="lg" boxShadow="md" overflow="hidden">
          <InputLeftElement pointerEvents="none" h="full" pl={4}>
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Поиск по направлениям, отелям или местам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            border="none"
            _focus={{ outline: 'none' }}
            fontSize="md"
            h="full"
            pl={12}
            color="gray.800"
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
            Поиск
          </Button>
        </InputGroup>
      </Box>
      
      <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={6}>
        {/* Filters Sidebar */}
        <Box
          as="aside"
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          h="fit-content"
          position={{ md: 'sticky' }}
          top={4}
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h2" size="md">
              Фильтры
            </Heading>
            <Button
              variant="link"
              colorScheme="brand"
              onClick={resetFilters}
              size="sm"
            >
              Сбросить все
            </Button>
          </Flex>
          
          <Stack spacing={6}>
            {/* Destination Filter */}
            <Box>
              <Text fontWeight="medium" mb={2}>
                Город
              </Text>
              <Select
                placeholder="Выберите город"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Box>
            
            {/* Price Range Filter */}
            <Box>
              <Text fontWeight="medium" mb={2}>
                Цена
              </Text>
              <VStack spacing={4}>
                <RangeSlider
                  aria-label={['min price', 'max price']}
                  defaultValue={[0, 999999]}
                  min={0}
                  max={999999}
                  step={10}
                  value={priceRange}
                  onChange={setPriceRange}
                >
                  <RangeSliderTrack bg="gray.200">
                    <RangeSliderFilledTrack bg="brand.500" />
                  </RangeSliderTrack>
                  <Tooltip
                    hasArrow
                    bg="brand.500"
                    color="white"
                    placement="top"
                    isOpen={true}
                    label={`$${priceRange[0]}`}
                  >
                    <RangeSliderThumb index={0} />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    bg="brand.500"
                    color="white"
                    placement="top"
                    isOpen={true}
                    label={`$${priceRange[1]}`}
                  >
                    <RangeSliderThumb index={1} />
                  </Tooltip>
                </RangeSlider>
                <Flex justify="space-between" w="full" fontSize="sm" color="gray.600">
                  <Text>${priceRange[0]}</Text>
                  <Text>${priceRange[1]}+</Text>
                </Flex>
              </VStack>
            </Box>
            
            {/* Фильтр рейтинга */}
            <Box>
              <Text fontWeight="medium" mb={2}>
                Рейтинг
              </Text>
              <VStack align="start" spacing={2}>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <Checkbox
                    key={stars}
                    isChecked={rating === stars}
                    onChange={() => setRating(rating === stars ? 0 : stars)}
                  >
                    <HStack spacing={1}>
                      {[...Array(stars)].map((_, i) => (
                        <StarIcon key={i} color="yellow.400" />
                      ))}
                      <Text fontSize="sm" color="gray.600">
                        {stars === 5 ? '' : '& up'}
                      </Text>
                    </HStack>
                  </Checkbox>
                ))}
              </VStack>
            </Box>
            
            {/* Фильтр удобств */}
            <Box>
              <Text fontWeight="medium" mb={2}>
                Удобства
              </Text>
              <VStack align="start" spacing={3}>
                {amenities.map((amenity) => (
                  <Checkbox
                    key={amenity.id}
                    isChecked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                  >
                    <HStack spacing={2}>
                      <Icon as={amenity.icon} color="brand.500" />
                      <Text fontSize="sm">{amenity.label}</Text>
                    </HStack>
                  </Checkbox>
                ))}
              </VStack>
            </Box>
          </Stack>
        </Box>
        
        {/* Результаты поиска */}
        <Box>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="lg">
              {query ? `Результаты поиска для "${query}"` : 'Все отели'}
            </Heading>
            <Text color="gray.600">
              {isLoading ? 'Загрузка...' : `${hotels?.total || 0} отелей найдено`}
            </Text>
          </Flex>
          
          {/* Кнопка фильтров для мобильных устройств */}
          {isMobile && (
            <Button
              leftIcon={<FaFilter />}
              onClick={onToggle}
              mb={4}
              width="full"
              variant="outline"
            >
              {isOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
            </Button>
          )}
          
          {/* Панель фильтров для мобильных устройств */}
          {isMobile && isOpen && (
            <Box
              bg="white"
              p={4}
              borderRadius="lg"
              boxShadow="md"
              mb={6}
            >
              <Stack spacing={6}>
                {/* Те же компоненты фильтров, что и в боковой панели */}
                {/* ... */}
              </Stack>
            </Box>
          )}
          
          {/* Результаты поиска */}
          {isLoading ? (
            <Stack spacing={6}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="200px" borderRadius="lg" />
              ))}
            </Stack>
          ) : hotels?.data?.length ? (
            <Stack spacing={6}>
              {hotels.data.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                />
              ))}
            </Stack>
          ) : (
            <Box
              textAlign="center"
              bg="white"
              p={12}
              borderRadius="lg"
              boxShadow="sm"
            >
              <Text fontSize="xl" fontWeight="medium" mb={4}>
                Нет отелей, соответствующих вашим критериям
              </Text>
              <Text color="gray.600" mb={6}>
                Попробуйте изменить параметры поиска или фильтры, чтобы найти то, что вам нужно.
              </Text>
              <Button
                colorScheme="brand"
                onClick={() => {
                  resetFilters();
                  setSearchQuery('');
                  setSearchParams({});
                }}
              >
                Сбросить все фильтры
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Container>
  );
};

export default SearchPage;
