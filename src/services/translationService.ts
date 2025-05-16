import { useState, useEffect } from 'react';

// Common travel phrases that would be useful in any language
export const commonTravelPhrases = [
  'Hello',
  'Goodbye',
  'Please',
  'Thank you',
  'Yes',
  'No',
  'Excuse me',
  'Do you speak English?',
  'I don\'t understand',
  'How much?',
  'Where is the bathroom?',
  'Help',
  'I need a doctor',
  'How do I get to...?',
  'One ticket please',
  'Delicious',
  'I\'m vegetarian',
  'The bill, please',
  'Good morning',
  'Good evening'
];

// ISO language codes for major languages
export const languageCodes: Record<string, string> = {
  'France': 'fr',
  'Italy': 'it',
  'Spain': 'es',
  'Japan': 'ja',
  'Germany': 'de',
  'Thailand': 'th',
  'China': 'zh',
  'Portugal': 'pt',
  'Netherlands': 'nl',
  'Sweden': 'sv',
  'Greece': 'el',
  'Russia': 'ru',
  'Korea': 'ko',
  'Turkey': 'tr',
  'Poland': 'pl',
  'Vietnam': 'vi',
  'Indonesia': 'id'
};

// Map cities to countries for language lookup
export const cityToCountry: Record<string, string> = {
  'Paris': 'France',
  'Nice': 'France',
  'Lyon': 'France',
  'Rome': 'Italy',
  'Milan': 'Italy',
  'Venice': 'Italy',
  'Florence': 'Italy',
  'Barcelona': 'Spain',
  'Madrid': 'Spain',
  'Seville': 'Spain',
  'Tokyo': 'Japan',
  'Kyoto': 'Japan',
  'Osaka': 'Japan',
  'Berlin': 'Germany',
  'Munich': 'Germany',
  'Frankfurt': 'Germany',
  'Bangkok': 'Thailand',
  'Phuket': 'Thailand',
  'Chiang Mai': 'Thailand',
  'Beijing': 'China',
  'Shanghai': 'China',
  'Lisbon': 'Portugal',
  'Porto': 'Portugal',
  'Amsterdam': 'Netherlands',
  'Stockholm': 'Sweden',
  'Athens': 'Greece',
  'Moscow': 'Russia',
  'Seoul': 'Korea',
  'Istanbul': 'Turkey',
  'Warsaw': 'Poland',
  'Hanoi': 'Vietnam',
  'Bali': 'Indonesia'
};

interface Translation {
  english: string;
  local: string;
  pronunciation?: string;
}

export interface TranslationResult {
  language: string;
  languageCode: string;
  translations: Translation[];
  loading: boolean;
  error: string | null;
}

// Function to get language code for a destination
export const getLanguageCode = (destination: string): string | null => {
  // Try to find the country for the city
  const country = cityToCountry[destination];
  
  // If country is found, get its language code
  if (country && languageCodes[country]) {
    return languageCodes[country];
  }
  
  // If destination itself is a country, get its language code
  if (languageCodes[destination]) {
    return languageCodes[destination];
  }
  
  // If no match found, return null
  return null;
};

// In a real app, this would make API calls to a translation service
// For now, we'll simulate it with mock data and delays
export const useTranslationService = (destination: string): TranslationResult => {
  const [result, setResult] = useState<TranslationResult>({
    language: '',
    languageCode: '',
    translations: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!destination) {
      setResult({
        language: '',
        languageCode: '',
        translations: [],
        loading: false,
        error: null
      });
      return;
    }

    const fetchTranslations = async () => {
      setResult(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Get language code
        const languageCode = getLanguageCode(destination);
        
        if (!languageCode) {
          setResult({
            language: '',
            languageCode: '',
            translations: [],
            loading: false,
            error: `No language found for destination: ${destination}`
          });
          return;
        }

        // Determine language name
        const country = cityToCountry[destination] || destination;
        const language = getLanguageName(country);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, here you would call the translation API
        // Example: const response = await fetch(`https://translation-api.com/translate?text=${phrases.join(',')}&target=${languageCode}`);
        
        // Mock translations based on language code
        const mockTranslations = getMockTranslations(languageCode);
        
        setResult({
          language,
          languageCode,
          translations: mockTranslations,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching translations:', error);
        setResult(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch translations'
        }));
      }
    };

    fetchTranslations();
  }, [destination]);

  return result;
};

// Helper to get language name from country
const getLanguageName = (country: string): string => {
  switch (country) {
    case 'France': return 'French';
    case 'Italy': return 'Italian';
    case 'Spain': return 'Spanish';
    case 'Japan': return 'Japanese';
    case 'Germany': return 'German';
    case 'Thailand': return 'Thai';
    case 'China': return 'Chinese';
    case 'Portugal': return 'Portuguese';
    case 'Netherlands': return 'Dutch';
    case 'Sweden': return 'Swedish';
    case 'Greece': return 'Greek';
    case 'Russia': return 'Russian';
    case 'Korea': return 'Korean';
    case 'Turkey': return 'Turkish';
    case 'Poland': return 'Polish';
    case 'Vietnam': return 'Vietnamese';
    case 'Indonesia': return 'Indonesian';
    default: return country;
  }
};

// Mock translations for demo purposes
// In a real app, these would come from an API
const getMockTranslations = (languageCode: string): Translation[] => {
  const mockData: Record<string, Translation[]> = {
    'fr': [
      { english: 'Hello', local: 'Bonjour', pronunciation: 'bon-zhoor' },
      { english: 'Goodbye', local: 'Au revoir', pronunciation: 'oh ruh-vwar' },
      { english: 'Please', local: 'S\'il vous plaît', pronunciation: 'seel voo pleh' },
      { english: 'Thank you', local: 'Merci', pronunciation: 'mehr-see' },
      { english: 'Yes', local: 'Oui', pronunciation: 'wee' },
      { english: 'No', local: 'Non', pronunciation: 'nohn' },
      { english: 'Excuse me', local: 'Excusez-moi', pronunciation: 'ex-koo-zay mwah' },
      { english: 'Do you speak English?', local: 'Parlez-vous anglais?', pronunciation: 'par-lay voo ahn-glay' },
      { english: 'I don\'t understand', local: 'Je ne comprends pas', pronunciation: 'zhuh nuh kom-prahn pah' },
      { english: 'How much?', local: 'Combien?', pronunciation: 'kom-bee-en' }
    ],
    'it': [
      { english: 'Hello', local: 'Ciao', pronunciation: 'chow' },
      { english: 'Goodbye', local: 'Arrivederci', pronunciation: 'ah-ree-veh-dehr-chee' },
      { english: 'Please', local: 'Per favore', pronunciation: 'pehr fah-voh-reh' },
      { english: 'Thank you', local: 'Grazie', pronunciation: 'grah-tsee-eh' },
      { english: 'Yes', local: 'Sì', pronunciation: 'see' },
      { english: 'No', local: 'No', pronunciation: 'noh' },
      { english: 'Excuse me', local: 'Scusi', pronunciation: 'skoo-zee' },
      { english: 'Do you speak English?', local: 'Parla inglese?', pronunciation: 'par-la een-gleh-seh' },
      { english: 'I don\'t understand', local: 'Non capisco', pronunciation: 'nohn kah-pee-skoh' },
      { english: 'How much?', local: 'Quanto costa?', pronunciation: 'kwan-toh kos-tah' }
    ],
    'es': [
      { english: 'Hello', local: 'Hola', pronunciation: 'oh-lah' },
      { english: 'Goodbye', local: 'Adiós', pronunciation: 'ah-dee-ohs' },
      { english: 'Please', local: 'Por favor', pronunciation: 'por fah-vor' },
      { english: 'Thank you', local: 'Gracias', pronunciation: 'grah-see-ahs' },
      { english: 'Yes', local: 'Sí', pronunciation: 'see' },
      { english: 'No', local: 'No', pronunciation: 'noh' },
      { english: 'Excuse me', local: 'Disculpe', pronunciation: 'dees-kool-peh' },
      { english: 'Do you speak English?', local: '¿Habla inglés?', pronunciation: 'ah-blah een-glehs' },
      { english: 'I don\'t understand', local: 'No entiendo', pronunciation: 'noh en-tee-en-doh' },
      { english: 'How much?', local: '¿Cuánto cuesta?', pronunciation: 'kwan-toh kweh-stah' }
    ]
  };

  return mockData[languageCode] || commonTravelPhrases.map(phrase => ({
    english: phrase,
    local: `[Translation for "${phrase}"]`,
    pronunciation: '[Pronunciation would be provided by API]'
  }));
}; 