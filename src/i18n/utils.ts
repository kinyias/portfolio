import { ui, defaultLang, showDefaultLang } from './ui';

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    const localized = ui[lang];
    if (localized && key in localized) {
      return localized[key as keyof typeof localized];
    }
    return ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: Lang = lang): string {
    // Ensure path has leading slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Default language has no prefix when showDefaultLang is false
    if (!showDefaultLang && l === defaultLang) {
      return normalizedPath;
    }
    
    // Secondary language prefix
    return `/${l}${normalizedPath === '/' ? '' : normalizedPath}`;
  };
}

export function getCleanPath(url: URL): string {
  const pathname = url.pathname;
  // Remove /vi or /en prefix if present
  const clean = pathname.replace(/^\/(?:vi|en)(?=\/|$)/, '');
  return clean === '' ? '/' : clean;
}
