import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const themes = [
  { id: 'beach', name: 'Beach', icon: '🏖️', emoji: '🌊' },
  { id: 'mountain', name: 'Mountain', icon: '🏔️', emoji: '🌲' },
  { id: 'city', name: 'City', icon: '🌆', emoji: '🏙️' },
  { id: 'classic', name: 'Classic', icon: '✈️', emoji: '🗺️' },
] as const;

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, colors } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // Show feedback message when theme changes
  useEffect(() => {
    const themeInfo = themes.find(t => t.id === theme);
    if (themeInfo) {
      setMessage(`${themeInfo.name} theme applied!`);
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [theme]);

  return (
    <>
      {/* Theme changed notification */}
      <div 
        className={`fixed bottom-24 right-6 z-50 transform transition-all duration-300 ${
          showMessage ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'
        }`}
      >
        <div className={`${colors.card} py-2 px-4 rounded-lg shadow-lg border ${colors.border} flex items-center`}>
          <span className="mr-2 text-xl">{themes.find(t => t.id === theme)?.emoji}</span>
          <span className={colors.text}>{message}</span>
        </div>
      </div>

      {/* Theme switcher */}
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          className={`${colors.card} rounded-lg shadow-xl border ${colors.border} overflow-hidden transition-all duration-300 ${
            isCollapsed ? 'w-12' : 'w-36'
          }`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full p-3 ${colors.secondary} flex items-center justify-center ${
              isCollapsed ? '' : 'border-b'
            } ${colors.border}`}
          >
            <span className="text-xl mr-2">🎨</span>
            {!isCollapsed && (
              <span className={`${colors.text} font-medium`}>Theme</span>
            )}
            <svg 
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${colors.text} ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`transition-all duration-300 ${isCollapsed ? 'max-h-0' : 'max-h-96'} overflow-hidden`}>
            <div className="p-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsCollapsed(true);
                  }}
                  className={`
                    w-full p-2 rounded-md my-1 transition-all duration-200 
                    flex items-center gap-2 transform hover:scale-105
                    ${theme === t.id 
                      ? `${colors.secondary} ring-2 ${colors.highlight}` 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {t.name}
                  </span>
                  {theme === t.id && (
                    <svg className="w-4 h-4 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSwitcher; 