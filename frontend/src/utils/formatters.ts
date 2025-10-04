/**
 * Форматирует число как строку валюты
 * @param amount - Сумма для форматирования
 * @param currency - Код валюты (по умолчанию: 'RUB')
 * @param locale - Локаль для форматирования (по умолчанию: 'ru-RU')
 * @returns Отформатированная строка валюты
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'RUB',
  locale: string = 'ru-RU'
): string => {
  // Обработка недействительной или отсутствующей суммы
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }

  // Форматирование валюты
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Форматирует число с определенным количеством знаков после запятой
 * @param value - Число для форматирования
 * @param decimals - Количество знаков после запятой (по умолчанию: 2)
 * @returns Отформатированная строка числа
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Форматирует строку даты в локальный формат даты
 * @param date - Строка даты или объект Date
 * @param options - Параметры форматирования даты
 * @returns Отформатированная строка даты
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Проверка валидности даты
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Обрезает текст до указанной длины и добавляет многоточие, если необходимо
 * @param text - Текст для обрезания
 * @param maxLength - Максимальная длина перед обрезанием
 * @returns Обрезанный текст с многоточием, если необходимо
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Преобразует строку в формат заголовка
 * @param str - Строка для преобразования
 * @returns Строка в формате заголовка
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

/**
 * Форматирует продолжительность в минутах в человеко-читаемый формат (например, "2ч. 30мин.")
 * @param minutes - Продолжительность в минутах
 * @returns Отформатированная строка продолжительности
 */
export const formatDuration = (minutes: number): string => {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
    return 'N/A';
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}ч. ${mins}мин.`;
  } else if (hours > 0) {
    return `${hours}ч.`;
  } else {
    return `${mins}мин.`;
  }
};
