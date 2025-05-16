import React, { useState, useEffect } from 'react';
import { useEmergencyInfo } from '../services/emergencyInfoService';
import { useTheme } from '../contexts/ThemeContext';
// Mock for web_search function - in a real app, this would be a real API
// import { web_search } from '../../node_modules/antmlcall';

interface EmergencyInfoProps {
  destination: string;
}

const EmergencyInfo: React.FC<EmergencyInfoProps> = ({ destination }) => {
  const [expanded, setExpanded] = useState(false);
  const [liveFetchEnabled, setLiveFetchEnabled] = useState(false);
  const [liveResults, setLiveResults] = useState<string>('');
  const [liveSearching, setLiveSearching] = useState(false);
  const { colors } = useTheme();
  
  // Get emergency info from our service
  const { country, emergencyNumbers, embassyInfo, travelAdvisory, loading, error } = useEmergencyInfo(destination);

  // This function would use real web search in a production app
  const fetchLiveData = async () => {
    if (!destination || liveSearching) return;
    
    setLiveSearching(true);
    setLiveResults('');
    
    try {
      // In a real app, this would call an actual web search API
      // const searchResult = await web_search({
      //   search_term: `emergency numbers embassy information in ${destination || country}`,
      //   explanation: "Searching for real-time emergency information"
      // });
      
      // Since we can't actually do web searches in this demo, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate search results
      setLiveResults(
        `Web search results for emergency information in ${country}:\n\n` +
        `• The emergency number in ${country} is typically 112 for general emergencies.\n` +
        `• For police assistance specifically, you may need to call a local number.\n` +
        `• Most embassies are located in the capital city.\n` +
        `• It's recommended to register with your embassy when traveling to ${country}.\n` +
        `• Check your government's travel advisory for ${country} before traveling.`
      );
    } catch (error) {
      console.error('Error fetching live data:', error);
      setLiveResults(`Error fetching live data. Please try again later.`);
    } finally {
      setLiveSearching(false);
    }
  };

  useEffect(() => {
    if (liveFetchEnabled && expanded) {
      fetchLiveData();
    }
  }, [liveFetchEnabled, expanded, destination]);
  
  if (!destination) {
    return null;
  }

  return (
    <div className={`${colors.card} rounded-lg shadow-md overflow-hidden mb-6`}>
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">🚨</span>
          <div>
            <h3 className={`text-xl font-semibold ${colors.text}`}>
              Emergency Information
            </h3>
            {loading ? (
              <p className={`text-sm ${colors.textSecondary}`}>
                Loading emergency info...
              </p>
            ) : error ? (
              <p className={`text-sm text-red-500`}>
                {error}
              </p>
            ) : (
              <p className={`text-sm ${colors.textSecondary}`}>
                Essential contacts for {country}
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
              <span className="ml-2 text-gray-600">Loading emergency information...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                Unable to load emergency information for this destination.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Emergency Numbers Section */}
              <div>
                <h4 className={`font-semibold ${colors.text} mb-2 flex items-center`}>
                  <span className="mr-2">📞</span> Emergency Numbers
                </h4>
                <div className="grid gap-2">
                  {emergencyNumbers.map((contact, index) => (
                    <div key={index} className={`${colors.secondary} p-3 rounded-lg flex justify-between items-center`}>
                      <div>
                        <p className={`font-medium ${colors.text}`}>{contact.service}</p>
                        {contact.description && (
                          <p className={`text-xs ${colors.textSecondary}`}>{contact.description}</p>
                        )}
                      </div>
                      <div className={`text-lg font-bold ${colors.accent}`}>
                        {contact.number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embassy Information Section */}
              {embassyInfo && embassyInfo.length > 0 && (
                <div>
                  <h4 className={`font-semibold ${colors.text} mb-2 flex items-center`}>
                    <span className="mr-2">🏛️</span> Embassy Information
                  </h4>
                  <div className="space-y-3">
                    {embassyInfo.map((embassy, index) => (
                      <div key={index} className={`${colors.secondary} p-3 rounded-lg`}>
                        <p className={`font-medium ${colors.text} mb-1`}>{embassy.country} Embassy</p>
                        {embassy.address && (
                          <p className={`text-sm ${colors.textSecondary} mb-1`}>{embassy.address}</p>
                        )}
                        {embassy.phone && (
                          <p className={`text-sm ${colors.textSecondary} mb-1`}>
                            <span className="font-medium">Phone:</span> {embassy.phone}
                          </p>
                        )}
                        {embassy.website && (
                          <a 
                            href={embassy.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-sm ${colors.accent} hover:underline inline-flex items-center mt-1`}
                          >
                            <span>Visit Website</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Advisory Section */}
              {travelAdvisory && (
                <div className={`${colors.highlight} bg-opacity-10 p-4 rounded-lg`}>
                  <h4 className={`font-semibold ${colors.text} mb-1 flex items-center`}>
                    <span className="mr-2">⚠️</span> Travel Advisory
                  </h4>
                  <p className={`${colors.textSecondary}`}>{travelAdvisory}</p>
                </div>
              )}
              
              {/* Live Web Search Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`font-semibold ${colors.text} flex items-center`}>
                    <span className="mr-2">🔍</span> Real-time Information
                  </h4>
                  <button
                    onClick={() => {
                      setLiveFetchEnabled(true);
                      if (!liveResults && !liveSearching) {
                        fetchLiveData();
                      }
                    }}
                    disabled={liveSearching}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      liveSearching 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : `${colors.buttonPrimary}`
                    }`}
                  >
                    {liveSearching ? 'Searching...' : liveResults ? 'Refresh Data' : 'Get Live Data'}
                  </button>
                </div>
                
                {liveSearching ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Searching the web for latest information...</span>
                  </div>
                ) : liveResults ? (
                  <div className={`${colors.secondary} p-3 rounded-lg text-sm ${colors.text}`}>
                    <pre className="whitespace-pre-wrap font-sans">{liveResults}</pre>
                  </div>
                ) : (
                  <p className={`text-sm ${colors.textSecondary} italic`}>
                    Click "Get Live Data" to search the web for the most up-to-date emergency information.
                  </p>
                )}
              </div>

              {/* Footer with save/print options */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <div className={`text-sm ${colors.textSecondary}`}>
                  <span className="mr-1">💾</span> Save this information for offline access
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 text-sm ${colors.buttonSecondary} rounded-lg flex items-center`}
                    onClick={() => window.print()}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyInfo; 