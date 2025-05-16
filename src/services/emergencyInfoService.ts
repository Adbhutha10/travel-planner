import { useState, useEffect } from 'react';
import { cityToCountry } from './translationService';

export interface EmergencyContact {
  service: string;
  number: string;
  description?: string;
}

export interface EmbassyInfo {
  country: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface EmergencyInfo {
  country: string;
  emergencyNumbers: EmergencyContact[];
  embassyInfo?: EmbassyInfo[];
  travelAdvisory?: string;
  loading: boolean;
  error: string | null;
}

// In a real app, this would fetch data from a travel API or scrape official government sites
export const useEmergencyInfo = (destination: string): EmergencyInfo => {
  const [info, setInfo] = useState<EmergencyInfo>({
    country: '',
    emergencyNumbers: [],
    embassyInfo: [],
    travelAdvisory: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!destination) {
      setInfo({
        country: '',
        emergencyNumbers: [],
        embassyInfo: [],
        travelAdvisory: '',
        loading: false,
        error: null
      });
      return;
    }

    const fetchEmergencyInfo = async () => {
      setInfo(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Determine country from city or use destination as country
        const country = cityToCountry[destination] || destination;
        
        // In a real app, you would fetch this data from an API or web scraping
        // Examples:
        // - Travel.state.gov API for US embassy info
        // - WHO or local government APIs for emergency numbers
        // - Foreign affairs ministry APIs for travel advisories
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // API call simulation
        // const response = await fetch(`https://travel-api.example.com/emergency-info/${country}`);
        // const data = await response.json();
        
        // Using mock data for demonstration
        const mockData = getMockEmergencyInfo(country);
        
        setInfo({
          ...mockData,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching emergency info:', error);
        setInfo(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch emergency information'
        }));
      }
    };

    // Use web search tool to get actual data in a real implementation
    fetchEmergencyInfo();
  }, [destination]);

  return info;
};

// Mock data for demonstration purposes
// In a real app, this would come from web API calls
const getMockEmergencyInfo = (country: string): EmergencyInfo => {
  const emergencyData: Record<string, Omit<EmergencyInfo, 'loading' | 'error'>> = {
    'France': {
      country: 'France',
      emergencyNumbers: [
        { service: 'General Emergency', number: '112', description: 'European emergency number' },
        { service: 'Police', number: '17' },
        { service: 'Ambulance', number: '15' },
        { service: 'Fire', number: '18' }
      ],
      embassyInfo: [
        { 
          country: 'United States', 
          address: '2 Avenue Gabriel, 75008 Paris, France',
          phone: '+33 1 43 12 22 22',
          website: 'https://fr.usembassy.gov/embassy-consulates/paris/'
        },
        { 
          country: 'United Kingdom', 
          address: '35 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
          phone: '+33 1 44 51 31 00',
          website: 'https://www.gov.uk/world/organisations/british-embassy-paris'
        }
      ],
      travelAdvisory: 'Exercise normal precautions in France.'
    },
    'Italy': {
      country: 'Italy',
      emergencyNumbers: [
        { service: 'General Emergency', number: '112', description: 'European emergency number' },
        { service: 'Police', number: '113' },
        { service: 'Ambulance', number: '118' },
        { service: 'Fire', number: '115' }
      ],
      embassyInfo: [
        { 
          country: 'United States', 
          address: 'Via Vittorio Veneto 121, 00187 Roma, Italy',
          phone: '+39 06 46741',
          website: 'https://it.usembassy.gov/'
        }
      ],
      travelAdvisory: 'Exercise normal precautions in Italy.'
    },
    'Japan': {
      country: 'Japan',
      emergencyNumbers: [
        { service: 'Police', number: '110' },
        { service: 'Ambulance/Fire', number: '119' }
      ],
      embassyInfo: [
        { 
          country: 'United States', 
          address: '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420, Japan',
          phone: '+81 3-3224-5000',
          website: 'https://jp.usembassy.gov/'
        }
      ],
      travelAdvisory: 'Exercise normal precautions in Japan.'
    }
  };

  // Return actual data if we have it
  if (emergencyData[country]) {
    return {
      ...emergencyData[country],
      loading: false,
      error: null
    };
  }

  // Return generic data for countries not in our mock database
  return {
    country: country,
    emergencyNumbers: [
      { service: 'General Emergency', number: '112', description: 'International emergency number (many countries)' },
      { service: 'Police', number: '-- Search online for local police --' },
      { service: 'Ambulance', number: '-- Search online for local ambulance --' },
      { service: 'Fire', number: '-- Search online for local fire department --' }
    ],
    embassyInfo: [
      { 
        country: 'Generic Embassy Info',
        address: 'Search for your country\'s embassy in ' + country,
        website: `https://www.google.com/search?q=US+embassy+in+${country}`
      }
    ],
    travelAdvisory: `Check your government's travel advisory for ${country}.`,
    loading: false,
    error: null
  };
}; 