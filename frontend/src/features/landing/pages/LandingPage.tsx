import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useBreakpointValue,
  SimpleGrid,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Tag,
  TagLabel,
  useToast,
  FormHelperText,
  Spinner,
  Center,
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaRegUser, FaRegHeart, FaRegClock, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDateToDisplay, pluralGuests } from '@/utils/dateUtils';
import { HotelCard } from '@/features/hotels/components/HotelCard';
import { mockHotels } from '@/features/landing/mocks/hotels';

export const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Цвета
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = 'blue.400';
  const gradient = `linear(to-r, ${accentColor}, #805AD5)`;

  // min для дат
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const checkoutMin = useMemo(() => {
    if (!checkIn) return todayISO;
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [checkIn, todayISO]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: 'Укажите направление',
        description: 'Например: Санкт-Петербург, Сочи или Казань',
        status: 'info',
        duration: 2500,
        isClosable: true,
      });
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      toast({
        title: 'Проверьте даты',
        description: 'Дата выезда должна быть позже даты заезда.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const params = new URLSearchParams();
    params.set('q', searchQuery.trim());
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));

    navigate(`/search?${params.toString()}`);
  };

  const features = [
    {
      icon: <FaRegUser size={24} color={accentColor} />,
      title: 'Персональные рекомендации',
      description: 'Подбор отелей под ваши предпочтения',
    },
    {
      icon: <FaRegHeart size={24} color={accentColor} />,
      title: 'Проверенные отзывы',
      description: 'Честные мнения реальных путешественников',
    },
    {
      icon: <FaRegClock size={24} color={accentColor} />,
      title: 'Экономия времени',
      description: 'Находите подходящий вариант за минуты',
    },
  ] as const;

  const popular = ['Санкт-Петербург', 'Москва', 'Сочи', 'Казань', 'Екатеринбург'];

  const PAGE_SIZE = 12;

  type CardHotel = typeof mockHotels[number];

  const [laneItems, setLaneItems] = useState<CardHotel[]>(() =>
    Array.from({ length: PAGE_SIZE }, (_, i) => {
      const src = mockHotels[i % mockHotels.length];
      return { ...src, id: `${src.id}-${i}` }; // уникальный id для key
    })
  );
  const [lanePage, setLanePage] = useState(1);
  const [isLaneLoading, setIsLaneLoading] = useState(false);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const getNextLaneChunk = useCallback((): CardHotel[] => {
    const start = lanePage * PAGE_SIZE;
    return Array.from({ length: PAGE_SIZE }, (_, idx) => {
      const src = mockHotels[(start + idx) % mockHotels.length];
      return { ...src, id: `${src.id}-${start + idx}` };
    });
  }, [lanePage]);

  useEffect(() => {
    const root = scrollerRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    let blocked = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !blocked) {
          blocked = true;
          setIsLaneLoading(true);
          // имитация задержки; можно убрать
          setTimeout(() => {
            setLaneItems((prev) => [...prev, ...getNextLaneChunk()]);
            setLanePage((p) => p + 1);
            setIsLaneLoading(false);
            blocked = false;
          }, 200);
        }
      },
      { root, rootMargin: '300px' } // грузим заранее
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [getNextLaneChunk]);

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  const resetForm = () => {
    setSearchQuery('');
    setCheckIn('');
    setCheckOut('');
    setGuests(2);
  };

  return (
    <Box bg={bgColor} minH="100vh" color={textColor}>
      {/* Хиро */}
      <Box position="relative" overflow="hidden" py={20}>
        <Box
          position="absolute"
          top={-24}
          left="50%"
          transform="translateX(-50%)"
          w="1200px"
          h="520px"
          rounded="full"
          filter="blur(48px)"
          opacity={0.4}
          bgGradient={`conic(from 180deg at 50% 50%, ${accentColor} 0deg, #805AD5 120deg, #D53F8C 240deg, ${accentColor} 360deg)`}
        />

        <Container maxW="container.lg" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Heading size="2xl" fontWeight="extrabold" maxW="2xl" lineHeight="1.2">
                Идеальный отдых:{' '}
                <Text as="span" display="block" bgGradient={gradient} bgClip="text">
                  друзья рекомендуют
                </Text>
              </Heading>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
              <Text fontSize="xl" color={mutedTextColor} maxW="2xl">
                Друзья уже съездили. Попробуйте и вы!
              </Text>
            </motion.div>

            {/* Форма поиска */}
            <Box w="full" maxW="3xl" mx="auto" mt={8}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <Box
                  as="form"
                  onSubmit={handleSearch}
                  bg={cardBg}
                  p={6}
                  rounded="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                  shadow="sm"
                >
                  {/* Быстрые направления */}
                  <HStack spacing={2} mb={4} wrap="wrap">
                    <Text color={mutedTextColor} fontSize="sm" mr={1}>
                      Популярно:
                    </Text>
                    {popular.map((city) => (
                      <Tag
                        key={city}
                        size="md"
                        variant="subtle"
                        colorScheme="blue"
                        cursor="pointer"
                        onClick={() => setSearchQuery(city)}
                      >
                        <TagLabel>{city}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" color={mutedTextColor}>
                        Направление
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaMapMarkerAlt color={String(mutedTextColor)} />
                        </InputLeftElement>
                        <Input
                          aria-label="Направление"
                          placeholder="Куда едем?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          borderColor={borderColor}
                          _hover={{ borderColor: accentColor }}
                        />
                      </InputGroup>
                      <FormHelperText color={mutedTextColor}>Например: «Сочи» или «Казань»</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" color={mutedTextColor}>
                        Заезд
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <CalendarIcon color={String(mutedTextColor)} />
                        </InputLeftElement>
                        <Input
                          aria-label="Дата заезда"
                          type="date"
                          lang="ru"
                          min={todayISO}
                          value={checkIn}
                          onChange={(e) => {
                            setCheckIn(e.target.value);
                            if (checkOut && e.target.value && checkOut <= e.target.value) {
                              // автоматически двигаем выезд на +1 день
                              const d = new Date(e.target.value);
                              d.setDate(d.getDate() + 1);
                              setCheckOut(d.toISOString().slice(0, 10));
                            }
                          }}
                          borderColor={borderColor}
                          _hover={{ borderColor: accentColor }}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" color={mutedTextColor}>
                        Выезд
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <CalendarIcon color={String(mutedTextColor)} />
                        </InputLeftElement>
                        <Input
                          aria-label="Дата выезда"
                          type="date"
                          lang="ru"
                          min={checkoutMin}
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          borderColor={borderColor}
                          _hover={{ borderColor: accentColor }}
                        />
                      </InputGroup>
                      {checkIn && (
                        <FormHelperText color={mutedTextColor}>
                          Не раньше {formatDateToDisplay(checkoutMin)}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" color={mutedTextColor}>
                        Гости
                      </FormLabel>
                      <NumberInput
                        min={1}
                        max={10}
                        value={guests}
                        onChange={(value) => setGuests(parseInt(value || '1'))}
                        aria-label="Количество гостей"
                      >
                        <NumberInputField borderColor={borderColor} _hover={{ borderColor: accentColor }} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText color={mutedTextColor}>
                        {guests} {pluralGuests(guests)}
                      </FormHelperText>
                    </FormControl>
                  </SimpleGrid>

                  <HStack mt={6} spacing={3} wrap="wrap">
                    <Button
                      type="submit"
                      size="lg"
                      w={{ base: 'full', md: 'auto' }}
                      bgGradient={gradient}
                      _hover={{ opacity: 0.9 }}
                      color="white"
                      rightIcon={<SearchIcon />}
                    >
                      Найти отели
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={resetForm}
                      color={mutedTextColor}
                      _hover={{ color: textColor, bg: useColorModeValue('gray.50', 'gray.700') }}
                    >
                      Сбросить
                    </Button>
                  </HStack>
                </Box>
              </motion.div>
            </Box>
            {/* Популярные отели (моки) - бесконечная галерея */}
            <Box w="full" mt={10} position="relative">
              <Heading size="lg" mb={4}>
                Популярные отели
              </Heading>

              {/* Кнопки-стрелки */}
              <IconButton
                aria-label="Назад"
                icon={<ChevronLeftIcon />}
                onClick={() => scrollBy(-320)}
                position="absolute"
                left={-12}
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
                variant="ghost"
                display={{ base: 'none', md: 'inline-flex' }}
              />
              <IconButton
                aria-label="Вперёд"
                icon={<ChevronRightIcon />}
                onClick={() => scrollBy(320)}
                position="absolute"
                right={-12}
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
                variant="ghost"
                display={{ base: 'none', md: 'inline-flex' }}
              />

              {/* Скроллер */}
              <HStack
                ref={scrollerRef}
                spacing={4}
                overflowX="auto"
                overflowY="hidden"
                py={2}
                px={{ base: 1, md: 10 }}  // запас под стрелки
                align="stretch"
                css={{
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'thin',
                }}
              >
                {laneItems.map((hotel) => (
                  <Box
                    key={hotel.id}
                    minW="280px"
                    maxW="280px"
                    scrollSnapAlign="start"
                    flex="0 0 auto"
                  >
                    <HotelCard hotel={hotel} variant="vertical" />
                  </Box>
                ))}

                {/* Сентинел для IntersectionObserver (должен быть в потоке справа) */}
                <Box ref={sentinelRef} minW="1px" minH="1px" />
              </HStack>

              {isLaneLoading && (
                <Box position="absolute" right={{ base: 3, md: 12 }} top={3}>
                  <Spinner size="sm" />
                </Box>
              )}
            </Box>


          </VStack>
        </Container>
      </Box>

      {/* Блок преимуществ */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={6}>
            <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto">
              <Text color={accentColor} fontWeight="semibold">
                ПОЧЕМУ МЫ
              </Text>
              <Heading size="xl" fontWeight="extrabold">
                Друзья плохого не посоветуют!
              </Heading>
              {/*<Text color={mutedTextColor}>
                А мы поможем вам провести отпуск там, где вы мечтали.
              </Text>*/}
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Box
                    bg={cardBg}
                    p={8}
                    rounded="xl"
                    borderWidth="1px"
                    borderColor={borderColor}
                    height="100%"
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'lg',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Box mb={4}>{feature.icon}</Box>
                    <Heading size="md" mb={2} color={textColor}>
                      {feature.title}
                    </Heading>
                    <Text color={mutedTextColor}>{feature.description}</Text>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
