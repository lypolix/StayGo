import { useState } from 'react';
import { Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Avatar, VStack, Text, useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '../../auth/authSlice';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const user = useAppSelector(selectCurrentUser);
  const toast = useToast();

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading user data...</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} mb={8}>
        <Avatar size="2xl" name={user.name} src={user.avatar} />
        <VStack spacing={2}>
          <Heading size="lg">{user.name}</Heading>
          <Text color="gray.500">{user.email}</Text>
        </VStack>
      </VStack>

      <Tabs index={activeTab} onChange={(index) => setActiveTab(index)} variant="enclosed" isFitted>
        <TabList mb={4}>
          <Tab>Personal Info</Tab>
          <Tab>Bookings</Tab>
          <Tab>Preferences</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text>Personal information will be displayed here</Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text>Your bookings will appear here</Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text>Your preferences will appear here</Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text>Account settings will appear here</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
