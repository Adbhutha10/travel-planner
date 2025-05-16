import React, { useState, useEffect } from 'react';
import { useTranslationService } from '../services/translationService';
import { useTheme } from '../contexts/ThemeContext';

interface LanguagePhrasebookProps {
  destination: string;
}

const LanguagePhrasebook: React.FC<LanguagePhrasebookProps> = ({ destination }) => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme();
  
  // Use the translation service hook instead of the hardcoded data
  const { language, translations, loading, error } = useTranslationService(destination);
  
  if (!destination || (!loading && !translations.length)) {
    return null;
  }
  
  const filteredPhrases = searchQuery.trim() === '' 
    ? translations 
    : translations.filter(phrase => 
        phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phrase.local.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const playPronunciation = (text: string) => {
    // In a real app, this would use the Web Speech API or connect to a pronunciation service
    // For now, we'll just use a placeholder
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <div className={`${colors.card} rounded-lg shadow-md overflow-hidden mb-6`}>
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">🗣️</span>
          <div>
            <h3 className={`text-xl font-semibold ${colors.text}`}>
              Language Phrasebook
            </h3>
            {loading ? (
              <p className={`text-sm ${colors.textSecondary}`}>
                Loading language data...
              </p>
            ) : error ? (
              <p className={`text-sm text-red-500`}>
                Error: {error}
              </p>
            ) : (
              <p className={`text-sm ${colors.textSecondary}`}>
                {language} phrases for your trip to {destination}
              </p>
            )}
          </div>
        </div>
        <button className={`${colors.highlight} rounded-full p-2 transition-transform duration-200 ${expanded ? 'transform rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading phrases...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                Unable to load language phrases for this destination.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 relative">
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-2 ${colors.input} rounded-lg focus:${colors.highlight} focus:ring-2 border ${colors.border}`}
                  placeholder="Search phrases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {filteredPhrases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No phrases match your search.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {filteredPhrases.map((phrase, index) => (
                    <div 
                      key={index} 
                      className={`${colors.secondary} rounded-lg p-3 transition-all hover:shadow-md`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-medium ${colors.text}`}>{phrase.english}</span>
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-500"
                          onClick={() => playPronunciation(phrase.local)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                      </div>
                      <div className={`text-lg font-semibold ${colors.accent}`}>
                        {phrase.local}
                      </div>
                      {phrase.pronunciation && (
                        <div className={`text-sm italic ${colors.textSecondary}`}>
                          {phrase.pronunciation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <div className={`text-sm ${colors.textSecondary}`}>
                  <span className="mr-1">🔊</span> Click the speaker icon to hear pronunciation
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`https://translate.google.com/?sl=en&tl=${language.toLowerCase()}&op=translate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1 text-sm ${colors.buttonSecondary} rounded-lg flex items-center`}
                  >
                    <span className="mr-1">🔍</span>
                    More translations
                  </a>
                  <button 
                    className={`px-3 py-1 text-sm ${colors.buttonSecondary} rounded-lg`}
                    onClick={() => window.print()}
                  >
                    Print Phrasebook
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguagePhrasebook; 