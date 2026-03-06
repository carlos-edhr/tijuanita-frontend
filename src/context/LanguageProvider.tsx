import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'es' | 'en';

const SPANISH_COUNTRY_CODES = [
  'ES', // España
  'MX', // México
  'CO', // Colombia
  'AR', // Argentina
  'CL', // Chile
  'PE', // Perú
  'EC', // Ecuador
  'BO', // Bolivia
  'PY', // Paraguay
  'UY', // Uruguay
  'GT', // Guatemala
  'HN', // Honduras
  'SV', // El Salvador
  'NI', // Nicaragua
  'CR', // Costa Rica
  'PA', // Panamá
  'DO', // República Dominicana
  'CU', // Cuba
  'VE', // Venezuela
];

const STORAGE_KEY = 'viarecreativa_language';

export type LocalizedField = { es?: string; en?: string };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  getLocalizedValue: <T extends Record<string, unknown>>(field: T | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') {
    return stored;
  }

  const browserLang = navigator.language || 'es';
  const browserLangUpper = browserLang.toUpperCase();

  if (SPANISH_COUNTRY_CODES.some(code => browserLangUpper.startsWith(code))) {
    return 'es';
  }

  if (browserLang.startsWith('es')) {
    return 'es';
  }

  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => detectLanguage());

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const getLocalizedValue = useCallback(<T extends Record<string, unknown>>(field: T | null | undefined): string => {
    // Handle null/undefined
    if (!field) return '';
    
    // Handle string values from API (e.g., "title": "Tijuanita mi ciudad")
    if (typeof field === 'string') {
      return field;
    }
    
    // Handle object values (e.g., { es: "...", en: "..." })
    if (typeof field === 'object') {
      return (field as Record<string, string>)[language] || (field as Record<string, string>)['es'] || '';
    }
    
    return '';
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getLocalizedValue }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
