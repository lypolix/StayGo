import type { Hotel } from '@/features/hotels/types';

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Отель Гранд',
    city: 'Москва',
    description: 'Роскошный отель в самом центре Москвы с потрясающими видами на город и первоклассным сервисом.',
    stars: 5,
    roomId: 'room-1',
    address: 'ул. Тверская, 1, Москва, 125009',
    rooms: ['room-1', 'room-2'],
    rating: 4.8,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        alt: 'Отель Гранд',
        isPrimary: true
      }
    ],
    amenities: ['wifi', 'pool', 'restaurant', 'ac', 'tv', 'breakfast', 'gym', 'spa'],
    isFavorite: false
  },
  {
    id: '2',
    name: 'Курорт Закат',
    city: 'Сочи',
    description: 'Отель на первой линии пляжа с роскошными номерами и прямым выходом к морю.',
    stars: 4,
    roomId: 'room-3',
    address: 'ул. Приморская, 10, Сочи, 354000',
    rooms: ['room-3', 'room-4'],
    rating: 4.6,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        alt: 'Курорт Закат',
        isPrimary: true
      }
    ],
    amenities: ['wifi', 'pool', 'restaurant', 'ac', 'tv', 'breakfast', 'bar'],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Горный приют',
    city: 'Красная Поляна',
    description: 'Уютный отель в горах с захватывающими видами и возможностями для активного отдыха.',
    stars: 4,
    roomId: 'room-5',
    address: 'ул. Горная, 5, Красная Поляна, 354392',
    rooms: ['room-5', 'room-6'],
    rating: 4.7,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        alt: 'Горный приют',
        isPrimary: true
      }
    ],
    amenities: ['wifi', 'parking', 'restaurant', 'ac', 'tv', 'breakfast'],
    isFavorite: false
  }
];

export default mockHotels;
