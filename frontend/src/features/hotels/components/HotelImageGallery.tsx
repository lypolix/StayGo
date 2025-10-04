// Будет дорабатываться

import { useState } from 'react';
import { Box, Image, IconButton, HStack, useBreakpointValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import type { Image as ImageType } from '@/shared/types';

interface HotelImageGalleryProps {
  images: ImageType[];
}

export const HotelImageGallery = ({ images }: HotelImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const showArrows = useBreakpointValue({ base: false, md: true });
  const showThumbnails = useBreakpointValue({ base: false, md: true });

  if (!images || images.length === 0) {
    return (
      <Box 
        width="100%" 
        height="400px" 
        bg="gray.100" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        borderRadius="lg"
        overflow="hidden"
      >
        No images available
      </Box>
    );
  }

  const currentImage = images[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box position="relative" width="100%" borderRadius="lg" overflow="hidden">
      {/* Основное изображение */}
      <Box 
        position="relative" 
        width="100%" 
        height={{ base: '300px', md: '500px' }}
        overflow="hidden"
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt || `Hotel image ${currentIndex + 1}`}
          objectFit="cover"
          width="100%"
          height="100%"
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.02)' }}
        />

        {/* Стрелки навигации */}
        {showArrows && (
          <>
            <IconButton
              aria-label="Previous image"
              icon={<ChevronLeftIcon boxSize={6} />}
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              borderRadius="full"
              bg="whiteAlpha.800"
              _hover={{ bg: 'white' }}
              onClick={goToPrev}
              disabled={!canGoPrev}
              opacity={canGoPrev ? 1 : 0}
              _disabled={{ opacity: 0, cursor: 'default' }}
              transition="opacity 0.2s"
              boxShadow="md"
            />
            <IconButton
              aria-label="Next image"
              icon={<ChevronRightIcon boxSize={6} />}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              borderRadius="full"
              bg="whiteAlpha.800"
              _hover={{ bg: 'white' }}
              onClick={goToNext}
              disabled={!canGoNext}
              opacity={canGoNext ? 1 : 0}
              _disabled={{ opacity: 0, cursor: 'default' }}
              transition="opacity 0.2s"
              boxShadow="md"
            />
          </>
        )}

        {/* Счетчик изображений */}
        <Box
          position="absolute"
          bottom={4}
          right={4}
          bg="blackAlpha.700"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="medium"
        >
          {currentIndex + 1} / {images.length}
        </Box>
      </Box>

      {/* Миниатюры */}
      {showThumbnails && images.length > 1 && (
        <HStack 
          spacing={2} 
          mt={3} 
          overflowX="auto"
          py={2}
          px={1}
          sx={{
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'gray.100',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'gray.400',
            },
          }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              flexShrink={0}
              width="80px"
              height="60px"
              borderRadius="md"
              overflow="hidden"
              borderWidth="2px"
              borderColor={index === currentIndex ? 'blue.500' : 'transparent'}
              cursor="pointer"
              onClick={() => goToImage(index)}
              opacity={index === currentIndex ? 1 : 0.7}
              _hover={{ opacity: 1 }}
              transition="all 0.2s"
            >
              <Image
                src={img.url}
                alt={img.alt || `Thumbnail ${index + 1}`}
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
};
