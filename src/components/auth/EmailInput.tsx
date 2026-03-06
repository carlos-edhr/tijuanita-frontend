import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean | null;
  mode?: 'login' | 'create';
  error?: string | null;
  success?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  isValid,
  mode = 'login',
  error,
  success,
  disabled = false,
  autoFocus = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const getBorderColor = () => {
    if (mode === 'login') return 'focus:border-[#4285F4] focus:ring-[#4285F4]';
    return 'focus:border-[#34A853] focus:ring-[#34A853]';
  };

  const getIconColor = () => {
    if (mode === 'login') return 'group-focus-within:text-[#4285F4]';
    return 'group-focus-within:text-[#34A853]';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="email"
          className="text-[#202124] text-sm font-medium font-sans"
        >
          Email Address
        </Label>
        <AnimatePresence>
          {isValid !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center gap-1 text-xs font-sans ${
                isValid ? 'text-[#34A853]' : 'text-[#EA4335]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {isValid ? 'Email valid!' : 'Invalid email'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group">
        <div
          className={`absolute inset-0 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${
            mode === 'login'
              ? 'bg-gradient-to-r from-[#4285F4]/10 to-[#4285F4]/10'
              : 'bg-gradient-to-r from-[#34A853]/10 to-[#34A853]/10'
          }`}
        />
        <div className="relative">
           <Input
             id="email"
             type="email"
             placeholder="you@example.com"
             value={value}
             onChange={handleChange}
             required
             aria-required="true"
             disabled={disabled}
             autoFocus={autoFocus}
             aria-invalid={isValid === false}
             aria-describedby={`${error ? 'email-error' : success ? 'email-success' : ''}`}
             className={`bg-white border-[#DADCE0] font-sans text-[#202124] placeholder:text-[#5F6368] h-12 rounded-lg pl-10 pr-4 transition-all duration-300 ${getBorderColor()}`}
           />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Mail
              className={`w-5 h-5 text-[#5F6368] transition-colors ${getIconColor()}`}
            />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid === true && (
              <div className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
            )}
            {isValid === false && (
              <div className="w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" />
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-2 h-0.5 bg-[#E8EAED] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853]"
            initial={{ width: 0 }}
            animate={{
              width:
                value.length === 0
                  ? '0%'
                  : isValid
                    ? '100%'
                    : '60%',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailInput;
