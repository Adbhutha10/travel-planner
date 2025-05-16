import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPlan } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import MapView from './MapView';
import { dayPlanToMapActivities, parseActivityString, formatActivityWithTags, addLocationToActivity, updateLocationInActivity } from '../services/mapService';

interface DayMapViewProps {
  day: DayPlan;
  destination: string;
  onUpdateActivities?: (activities: string[]) => void;
}

const DayMapView: React.FC<DayMapViewProps> = ({ day, destination, onUpdateActivities }) => {
  const { colors } = useTheme();
  const [showAddLocationInput, setShowAddLocationInput] = useState<number | null>(null);
  const [showEditLocationInput, setShowEditLocationInput] = useState<number | null>(null);
  const [locationInput, setLocationInput] = useState('');
  
  // Convert activities to the format expected by MapView
  const mapActivities = dayPlanToMapActivities(day);
  
  const handleAddLocation = (index: number) => {
    if (!onUpdateActivities || !day.activities) return;
    
    // Only process if we have a non-empty location
    if (locationInput.trim()) {
      const updatedActivities = day.activities.map((activity, i) => {
        if (i === index) {
          return addLocationToActivity(activity, locationInput.trim());
        }
        return activity;
      });
      
      onUpdateActivities(updatedActivities);
      setLocationInput('');
      setShowAddLocationInput(null);
    }
  };

  const handleEditLocation = (index: number) => {
    if (!onUpdateActivities || !day.activities) return;
    
    // Only process if we have a non-empty location
    if (locationInput.trim()) {
      const updatedActivities = day.activities.map((activity, i) => {
        if (i === index) {
          return updateLocationInActivity(activity, locationInput.trim());
        }
        return activity;
      });
      
      onUpdateActivities(updatedActivities);
      setLocationInput('');
      setShowEditLocationInput(null);
    }
  };
  
  const openEditLocation = (index: number, currentLocation: string) => {
    setShowAddLocationInput(null);
    setShowEditLocationInput(index);
    setLocationInput(currentLocation || '');
  };
  
  return (
    <div className={`${colors.card} rounded-lg shadow-md overflow-hidden mb-6`}>
      <div className={`p-4 ${colors.secondary} border-b ${colors.border}`}>
        <h3 className={`text-xl font-semibold ${colors.text}`}>
          {format(day.date, 'EEEE, MMMM d, yyyy')} - Activity Map
        </h3>
        <p className={`text-sm ${colors.textSecondary}`}>
          {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} planned for this day
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:min-h-[500px]">
        {/* Activities List Panel */}
        <div className={`p-4 ${colors.border} border-r overflow-y-auto lg:max-h-[600px]`}>
          <h4 className={`font-medium ${colors.text} mb-3 sticky top-0 bg-white py-2 z-10`}>Activities</h4>
          
          {day.activities.length === 0 ? (
            <p className={`text-sm italic ${colors.textSecondary}`}>
              No activities planned for this day yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {mapActivities.map((activity, index) => {
                const isAutoDetectedLocation = activity.isAutoDetected;
                
                return (
                  <li key={index} className={`${colors.secondary} p-3 rounded-lg`}>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className={`${colors.text}`}>{activity.title}</p>
                        
                        {/* Show location and time if they exist */}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {activity.location && (
                            <span className={`inline-flex items-center text-xs ${
                              isAutoDetectedLocation ? 'bg-yellow-100 text-yellow-800' : colors.highlight
                            } px-2 py-1 rounded-full group relative`}>
                              <span className="mr-1">📍</span> {activity.location}
                              
                              {isAutoDetectedLocation && (
                                <span className="inline-flex ml-1 text-yellow-600 cursor-help group-hover:text-yellow-800">
                                  (auto)
                                  <span className="absolute bottom-full left-0 mb-1 w-48 bg-white text-xs text-gray-700 p-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                    Location automatically detected from activity name. Edit if needed.
                                  </span>
                                </span>
                              )}
                              
                              {onUpdateActivities && (
                                <button
                                  className={`ml-2 text-xs ${colors.accent} hover:underline flex items-center opacity-0 group-hover:opacity-100 transition-opacity`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditLocation(index, activity.location || '');
                                  }}
                                >
                                  <span>✏️</span>
                                </button>
                              )}
                            </span>
                          )}
                          
                          {activity.time && (
                            <span className={`inline-flex items-center text-xs ${colors.highlight} px-2 py-1 rounded-full`}>
                              <span className="mr-1">🕒</span> {activity.time}
                            </span>
                          )}
                        </div>
                        
                        {/* Add location input */}
                        {showAddLocationInput === index && onUpdateActivities && (
                          <div className="mt-2 flex">
                            <input
                              type="text"
                              className="flex-grow p-1 text-sm border rounded"
                              placeholder="Enter location"
                              value={locationInput}
                              onChange={(e) => setLocationInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddLocation(index);
                                } else if (e.key === 'Escape') {
                                  setShowAddLocationInput(null);
                                  setLocationInput('');
                                }
                              }}
                              autoFocus
                            />
                            <button
                              className={`ml-2 px-2 py-1 text-xs ${colors.buttonPrimary} rounded`}
                              onClick={() => handleAddLocation(index)}
                            >
                              Add
                            </button>
                            <button
                              className={`ml-1 px-2 py-1 text-xs ${colors.buttonSecondary} rounded`}
                              onClick={() => {
                                setShowAddLocationInput(null);
                                setLocationInput('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        
                        {/* Edit location input */}
                        {showEditLocationInput === index && onUpdateActivities && (
                          <div className="mt-2 flex">
                            <input
                              type="text"
                              className="flex-grow p-1 text-sm border rounded"
                              placeholder="Edit location"
                              value={locationInput}
                              onChange={(e) => setLocationInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditLocation(index);
                                } else if (e.key === 'Escape') {
                                  setShowEditLocationInput(null);
                                  setLocationInput('');
                                }
                              }}
                              autoFocus
                            />
                            <button
                              className={`ml-2 px-2 py-1 text-xs ${colors.buttonPrimary} rounded`}
                              onClick={() => handleEditLocation(index)}
                            >
                              Update
                            </button>
                            <button
                              className={`ml-1 px-2 py-1 text-xs ${colors.buttonSecondary} rounded`}
                              onClick={() => {
                                setShowEditLocationInput(null);
                                setLocationInput('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Add location button */}
                      {!activity.location && onUpdateActivities && (
                        <button
                          className={`ml-2 text-xs ${colors.accent} hover:underline flex items-center`}
                          onClick={() => {
                            setShowEditLocationInput(null);
                            setShowAddLocationInput(index);
                            setLocationInput('');
                          }}
                        >
                          <span>Add Location</span>
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Map Panel */}
        <div className="h-[450px] lg:h-full relative">
          <div className="h-full">
            <MapView 
              activities={mapActivities}
              destination={destination}
              dayTitle={`Map for ${format(day.date, 'MMM d, yyyy')}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayMapView; 