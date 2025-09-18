// Типы
export * from './types';

// API
import { userApi } from '@/app/api/userApi';
export { userApi };

// Страницы
export { default as ProfilePage } from './pages/ProfilePage';

// Компоненты
// экспорт любых компонентов, относящихся к пользователю

// Хуки
export { useUser } from './hooks/useUser';

// Если будет пользовательский слайс, экспорт здесь
// export { default as userReducer, userActions } from './userSlice';
