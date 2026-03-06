import { useState, useCallback } from 'react';

export type Language = 'es' | 'en';

export interface LocalizedField {
  es: string;
  en: string;
}

export interface UseLocalizationReturn<T extends Record<string, unknown>> {
  activeLang: Language;
  setActiveLang: (lang: Language) => void;
  updateLocalizedField: (field: keyof T, lang: Language, value: string) => void;
  getLocalizedValue: (field: keyof T) => string;
}

export function useLocalization<T extends Record<string, unknown>>(
  content: T,
  onChange: (content: T) => void,
  initialLang: Language = 'es'
): UseLocalizationReturn<T> {
  const [activeLang, setActiveLang] = useState<Language>(initialLang);

  const updateLocalizedField = useCallback(
    (field: keyof T, lang: Language, value: string) => {
      const current = content[field];
      if (current && typeof current === 'object') {
        onChange({
          ...content,
          [field]: { ...(current as Record<string, string>), [lang]: value },
        });
      }
    },
    [content, onChange]
  );

  const getLocalizedValue = useCallback(
    (field: keyof T): string => {
      const value = content[field];
      if (value && typeof value === 'object') {
        return (value as Record<string, string>)[activeLang] || '';
      }
      return '';
    },
    [content, activeLang]
  );

  return {
    activeLang,
    setActiveLang,
    updateLocalizedField,
    getLocalizedValue,
  };
}

export function createLocalizedField(es: string = '', en: string = ''): LocalizedField {
  return { es, en };
}

export function mergeLocalizedFields<T extends Record<string, unknown>>(
  target: T,
  source: Partial<Record<Language, string>>,
  fieldName: keyof T
): T {
  const current = target[fieldName];
  if (current && typeof current === 'object') {
    return {
      ...target,
      [fieldName]: {
        ...(current as Record<string, string>),
        ...source,
      },
    };
  }
  return target;
}

export function getNestedLocalizedValue(
  obj: Record<string, unknown> | null | undefined,
  lang: Language = 'es'
): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[lang] || '';
}

export function setNestedLocalizedValue(
  obj: Record<string, unknown>,
  lang: Language,
  value: string
): Record<string, unknown> {
  return {
    ...obj,
    [lang]: value,
  };
}
