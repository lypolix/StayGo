/**
 * Утилиты для работы с датами
 */

/**
 * Форматирует строку даты из формата YYYY-MM-DD в dd.mm.yyyy
 * @param dateString Строка даты в формате YYYY-MM-DD
 * @returns Отформатированная строка даты в формате dd.mm.yyyy или пустая строка, если ввод недействителен
 */
export const formatDateToDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

/**
 * Преобразует строку даты из формата dd.mm.yyyy в YYYY-MM-DD
 * @param displayDate Строка даты в формате dd.mm.yyyy
 * @returns Строка даты в формате YYYY-MM-DD или пустая строка, если ввод недействителен
 */
export const parseDisplayDate = (displayDate: string): string => {
  if (!displayDate) return '';
  const [day, month, year] = displayDate.split('.');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Форматирует количество гостей с правильной формой русского языка
 * @param n Количество гостей
 * @returns Отформатированная строка с правильной формой (гость/гостя/гостей)
 */
export { pluralGuests } from './plural';

