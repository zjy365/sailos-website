import type { I18nConfig } from 'fumadocs-core/i18n';

export const LANGUAGES = ['en', 'zh'];

export const i18n: I18nConfig = {
  defaultLanguage: 'en',
  languages: LANGUAGES,
  hideLocale: 'never',
};

export const locales = [
  { name: 'English', locale: 'en' },
  { name: '简体中文', locale: 'zh' },
];
