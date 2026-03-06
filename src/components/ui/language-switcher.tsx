import React from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'buttons' | 'dropdown';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className,
  variant = 'buttons'
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'dropdown') {
    return (
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
        className={cn(
          'bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-moradoSecundario',
          className
        )}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => setLanguage('es')}
        className={cn(
          'px-2 py-1 text-sm font-medium rounded-md transition-all duration-200',
          language === 'es'
            ? 'bg-moradoSecundario text-white'
            : 'text-blackOlive hover:bg-gray-100'
        )}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'px-2 py-1 text-sm font-medium rounded-md transition-all duration-200',
          language === 'en'
            ? 'bg-moradoSecundario text-white'
            : 'text-blackOlive hover:bg-gray-100'
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
