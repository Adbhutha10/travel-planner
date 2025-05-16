import React, { createContext, useContext, useState } from 'react';

type ThemeType = 'beach' | 'mountain' | 'city' | 'classic';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  cardHover: string;
  text: string;
  textSecondary: string;
  border: string;
  icon: string;
  gradient: string;
  shadow: string;
  buttonPrimary: string;
  buttonSecondary: string;
  highlight: string;
  pattern: string;
  input: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
}

const themeColors: Record<ThemeType, ThemeColors> = {
  beach: {
    primary: 'from-orange-400 to-amber-500',
    secondary: 'bg-amber-50',
    accent: 'text-orange-600',
    background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white/95',
    text: 'text-amber-900',
    textSecondary: 'text-amber-700',
    border: 'border-amber-200',
    icon: '🏖️',
    gradient: 'bg-gradient-to-r from-orange-400 to-amber-500',
    shadow: 'shadow-amber-200/50',
    buttonPrimary: 'bg-orange-500 hover:bg-orange-600 text-white',
    buttonSecondary: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
    highlight: 'ring-orange-400',
    pattern: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    input: 'bg-white text-amber-900'
  },
  mountain: {
    primary: 'from-sky-400 to-blue-500',
    secondary: 'bg-sky-50',
    accent: 'text-sky-600',
    background: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white/95',
    text: 'text-sky-900',
    textSecondary: 'text-sky-700',
    border: 'border-sky-200',
    icon: '🏔️',
    gradient: 'bg-gradient-to-r from-sky-400 to-blue-500',
    shadow: 'shadow-sky-200/50',
    buttonPrimary: 'bg-sky-500 hover:bg-sky-600 text-white',
    buttonSecondary: 'bg-sky-100 hover:bg-sky-200 text-sky-900',
    highlight: 'ring-sky-400',
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    input: 'bg-white text-sky-900'
  },
  city: {
    primary: 'from-gray-700 to-gray-900',
    secondary: 'bg-gray-800',
    accent: 'text-purple-400',
    background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    card: 'bg-gray-800/90 backdrop-blur-sm',
    cardHover: 'hover:bg-gray-800/95',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    icon: '🌆',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    shadow: 'shadow-purple-900/50',
    buttonPrimary: 'bg-purple-500 hover:bg-purple-600 text-white',
    buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
    highlight: 'ring-purple-500',
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Cpath d='M30 0L0 30h60L30 0zm0 60L0 30h60L30 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    input: 'bg-gray-700 text-white'
  },
  classic: {
    primary: 'from-blue-600 to-indigo-700',
    secondary: 'bg-blue-50',
    accent: 'text-blue-600',
    background: 'bg-gray-50',
    card: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    icon: '✈️',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    shadow: 'shadow-blue-200/50',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: 'bg-white hover:bg-gray-50 text-gray-900',
    highlight: 'ring-blue-400',
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    input: 'bg-white text-gray-900'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('classic');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themeColors[theme] }}>
      <div 
        className={`min-h-screen transition-colors duration-300 ease-in-out ${themeColors[theme].background}`}
        style={{ backgroundImage: themeColors[theme].pattern }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 