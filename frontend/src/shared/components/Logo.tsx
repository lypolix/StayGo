import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Logo = () => {
  const accentColor = useColorModeValue('blue.400', 'blue.300');
  const gradient = `linear(to-r, ${accentColor}, #805AD5)`;

  return (
    <Link to="/">
      <Box display="flex" alignItems="center">
        <Text
          fontSize="xl"
          fontWeight="bold"
          bgGradient={gradient}
          bgClip="text"
          letterSpacing="tighter"
        >
          StayGo
        </Text>
      </Box>
    </Link>
  );
};
