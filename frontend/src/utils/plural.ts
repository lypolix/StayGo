/**
 * Функции для работы с русским языком
 */

type RuForms = [one: string, few: string, many: string]; // напр. ['гость','гостя','гостей']

const ruPR =
  typeof Intl !== 'undefined' && 'PluralRules' in Intl
    ? new Intl.PluralRules('ru-RU')
    : null;

const fallbackRuCategory = (nRaw: number) => {
  const n = Math.abs(Math.trunc(nRaw));
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'one';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
  return 'many';
};

export const pluralizeRu = (n: number, [one, few, many]: RuForms): string => {
  const category = ruPR ? ruPR.select(Math.abs(n)) : fallbackRuCategory(n);
  if (category === 'one') return one;
  if (category === 'few') return few;
  return many;
};

export const formatCountRu = (
  n: number,
  forms: RuForms,
  opts?: { withNumber?: boolean; locale?: string; number?: Intl.NumberFormatOptions; sep?: string }
): string => {
  const { withNumber = true, locale = 'ru-RU', number: numOpts, sep = ' ' } = opts ?? {};
  const word = pluralizeRu(n, forms);
  if (!withNumber) return word;
  const nf = new Intl.NumberFormat(locale, numOpts);
  return `${nf.format(n)}${sep}${word}`;
};

export const guestsText = (n: number, withNumber = true) =>
  formatCountRu(n, ['гость', 'гостя', 'гостей'], { withNumber });

export const nightsText = (n: number, withNumber = true) =>
  formatCountRu(n, ['ночь', 'ночи', 'ночей'], { withNumber });

export const pluralGuests = (n: number): string =>
  pluralizeRu(n, ['гость', 'гостя', 'гостей']);

