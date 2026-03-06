import React from 'react';
import { motion } from 'framer-motion';

interface ModeToggleProps {
  mode: 'login' | 'create';
  onModeChange: (mode: 'login' | 'create') => void;
  className?: string;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      role="tablist"
      className={`inline-flex items-center bg-[#F8F9FA] rounded-full p-1 border border-[#DADCE0] mb-6 ${className}`}
    >
      <button
        type="button"
        onClick={() => onModeChange('login')}
        aria-selected={mode === 'login'}
        role="tab"
        className={`px-6 py-2 rounded-full text-sm font-medium font-sans transition-all duration-300 hover:scale-105 ${
          mode === 'login'
            ? 'bg-[#4285F4] text-white shadow-md'
            : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#E8EAED]'
        }`}
      >
        Login with Access Link
      </button>
      <button
        type="button"
        onClick={() => onModeChange('create')}
        aria-selected={mode === 'create'}
        role="tab"
        className={`px-6 py-2 rounded-full text-sm font-medium font-sans transition-all duration-300 hover:scale-105 ${
          mode === 'create'
            ? 'bg-[#34A853] text-white shadow-md'
            : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#E8EAED]'
        }`}
      >
        Create Account
      </button>
    </motion.div>
  );
};

export default ModeToggle;
