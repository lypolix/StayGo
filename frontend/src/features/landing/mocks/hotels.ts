import type { Hotel } from '@/features/hotels/types';

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Horizon Hotel',
    city: 'New York',
    description: 'Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities.',
    stars: 5,
    roomId: 'room-1',
    address: '123 Broadway, New York, NY 10001',
    rooms: ['room-1', 'room-2'],
    rating: 4.8,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        alt: 'Grand Horizon Hotel',
        isPrimary: true
      }
    ],
    amenities: ['wifi', 'pool', 'restaurant', 'ac', 'tv', 'breakfast', 'gym', 'spa'],
    isFavorite: false
  },
  {
    id: '2',
    name: 'Sunset Resort & Spa',
    city: 'Miami',
    description: 'Beachfront resort offering luxurious accommodations and direct beach access.',
    stars: 4,
    roomId: 'room-3',
    address: '456 Ocean Drive, Miami Beach, FL 33139',
    rooms: ['room-3', 'room-4'],
    rating: 4.6,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        alt: 'Sunset Resort & Spa',
        isPrimary: true
      }
    ],
    amenities: ['wifi', 'pool', 'restaurant', 'ac', 'tv', 'breakfast', 'bar'],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Mountain View Lodge',
    city: 'Denver',
    description: 'Cozy lodge nestled in the mountains with breathtaking views and outdoor activities.',
    stars: 4,
    roomId: 'room-5',
    address: '789 Alpine Way, Denver, CO 80202',
    rooms: ['room-5', 'room-6'],
    rating: 4.7,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        alt: 'Mountain View Lodge',
        isPrimary: true
      }
    ],
    amenities: ['wifi', 'parking', 'restaurant', 'ac', 'tv', 'breakfast'],
    isFavorite: false
  }
];

export default mockHotels;
