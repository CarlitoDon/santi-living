import 'server-only';

const dictionaries = {
  id: () => import('./id.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
};

export type Locale = 'id' | 'en';
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] ? await dictionaries[locale]() : await dictionaries['id']();
};
