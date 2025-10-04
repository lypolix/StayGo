/**
 * Хук useUser предоставляет функционал для работы с данными пользователя.
 * 
 * Основные возможности:
 * - Получение данных текущего аутентифицированного пользователя
 * - Проверка аутентификации пользователя
 * - Управление избранными отелями (добавление/удаление)
 * 
 * Возвращает объект с:
 * - user: Данные текущего пользователя
 * - isAuthenticated: Флаг аутентификации
 * - toggleFavorite: Функция для переключения статуса избранного у отеля
 */

import { useCallback } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '@/app/api/favoriteApi';

export const useUser = () => {
  const user = useAppSelector(selectCurrentUser);
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const toggleFavorite = useCallback(async (hotelId: string, isCurrentlyFavorite: boolean) => {
    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorites({ room_id: Number(hotelId) }).unwrap();
        return { success: true, action: 'removed' };
      } else {
        await addToFavorites({ room_id: Number(hotelId) }).unwrap();
        return { success: true, action: 'added' };
      }
    } catch (error) {
      console.error('Failed to update favorites:', error);
      return { success: false, error };
    }
  }, [addToFavorites, removeFromFavorites]);

  return {
    user,
    isAuthenticated: !!user,
    toggleFavorite,
  };
};
