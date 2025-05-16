import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { getActivitiesForDestination } from '../data/popularActivities';
import { useTheme } from '../contexts/ThemeContext';

interface ActivitySuggestionsProps {
  destination: string;
  onAddActivity: (activity: string) => void;
}

const ActivitySuggestions: React.FC<ActivitySuggestionsProps> = ({ destination, onAddActivity }) => {
  const [suggestions, setSuggestions] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedActivities, setAddedActivities] = useState<Set<string>>(new Set());
  const { colors } = useTheme();

  const categories = {
    'all': '🌟 All',
    'Sightseeing': '🏛️ Sightseeing',
    'Food & Drink': '🍽️ Food & Drink',
    'Culture': '🎭 Culture',
    'Adventure': '🏃‍♂️ Adventure',
    'Shopping': '🛍️ Shopping'
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!destination) return;
      setLoading(true);
      setError(null);
      try {
        // Add a small delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 800));
        const activities = getActivitiesForDestination(destination);
        setSuggestions(activities);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to load activity suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
    setAddedActivities(new Set()); // Reset added activities when destination changes
  }, [destination]);

  const handleAddActivity = (activity: Activity) => {
    onAddActivity(activity.title);
    setAddedActivities(prev => new Set(Array.from(prev).concat(activity.title)));
  };

  const filteredSuggestions = suggestions.filter(
    activity => selectedCategory === 'all' || activity.category === selectedCategory
  );

  if (!destination) return null;

  return (
    <div className={`${colors.card} rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl transform`}>
      <h3 className={`text-2xl font-bold mb-6 flex items-center ${colors.text}`}>
        <span className="mr-2">🎯</span>
        Popular Activities
        <span className={`ml-auto text-sm font-normal ${colors.buttonSecondary} px-3 py-1 rounded-full`}>
          {filteredSuggestions.length} {filteredSuggestions.length === 1 ? 'activity' : 'activities'}
        </span>
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-6 -mx-1 pb-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform ${
              selectedCategory === key
                ? `${colors.buttonPrimary} shadow-md scale-105`
                : `bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105`
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-1">
            Activity suggestions couldn't be loaded. Please try again later.
          </p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid gap-4 transition-all">
          {filteredSuggestions.map((activity, index) => (
            <div
              key={index}
              className={`${colors.secondary} border ${colors.highlight} border-opacity-30 rounded-xl p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${colors.highlight} bg-opacity-20 h-10 w-10 flex items-center justify-center rounded-full`} role="img" aria-label={activity.category}>
                    {categories[activity.category as keyof typeof categories]?.split(' ')[0]}
                  </span>
                  <div>
                    <span className={`font-semibold ${colors.text}`}>{activity.title}</span>
                    {activity.popular && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-sm ${colors.textSecondary} bg-gray-100 px-2 py-1 rounded-full`}>
                  {activity.duration}
                </span>
              </div>
              
              <p className={`${colors.textSecondary} text-sm mb-4`}>
                {activity.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 ${colors.highlight} bg-opacity-10 ${colors.accent} rounded-full`}>
                  {activity.category}
                </span>
                
                <button
                  onClick={() => handleAddActivity(activity)}
                  disabled={addedActivities.has(activity.title)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1
                    transition-all duration-200 transform 
                    ${
                      addedActivities.has(activity.title)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : `${colors.buttonPrimary} hover:scale-105`
                    }
                  `}
                >
                  {addedActivities.has(activity.title) ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && !error && filteredSuggestions.length === 0 && (
        <div className={`text-center py-8 ${colors.textSecondary}`}>
          <p>No activities found for this category.</p>
          <button 
            onClick={() => setSelectedCategory('all')}
            className="mt-2 underline text-blue-500 hover:text-blue-700"
          >
            Show all activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitySuggestions; 