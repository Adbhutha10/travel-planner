import React, { useState, useEffect } from 'react';
import { addDays, differenceInDays, isSameDay, startOfDay, format } from 'date-fns';
import Countdown from './components/Countdown';
import DayPlanner from './components/DayPlanner';
import DestinationImage from './components/DestinationImage';
import ActivitySuggestions from './components/ActivitySuggestions';
import CalendarView from './components/CalendarView';
import TripOverview from './components/TripOverview';
import ThemeSwitcher from './components/ThemeSwitcher';
import WeatherForecast from './components/WeatherForecast';
import LanguagePhrasebook from './components/LanguagePhrasebook';
import EmergencyInfo from './components/EmergencyInfo';
import DayMapView from './components/DayMapView';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import { TripDetails, DayPlan } from './types';

function AppContent() {
  const [tripDetails, setTripDetails] = useState<TripDetails>(() => {
    const today = new Date();
    const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return {
      destination: '',
      startDate: localDate,
      endDate: localDate,
    };
  });

  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showMap, setShowMap] = useState<boolean>(false);
  const { colors, theme, setTheme } = useTheme();

  const handleTripDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = startOfDay(tripDetails.startDate);
    const end = startOfDay(tripDetails.endDate);
    const numberOfDays = differenceInDays(end, start) + 1;
    
    const newDayPlans = Array.from({ length: numberOfDays }, (_, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      date: addDays(start, index),
      activities: [],
      notes: '',
      icon: '📅'
    }));

    setDayPlans(newDayPlans);
    if (newDayPlans.length > 0) {
      setSelectedDayId(newDayPlans[0].id);
    }
  };

  const handleDayPlanUpdate = (updatedDay: DayPlan) => {
    setDayPlans(currentPlans =>
      currentPlans.map(day => (day.id === updatedDay.id ? updatedDay : day))
    );
  };

  const handleUpdateActivities = (dayId: string, activities: string[]) => {
    setDayPlans(currentPlans =>
      currentPlans.map(day => (day.id === dayId ? { ...day, activities } : day))
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Reordering days
    if (result.type === 'day') {
      const items = Array.from(dayPlans);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setDayPlans(items);
      return;
    }

    // Reordering activities within a day
    const dayId = source.droppableId.replace('activities-', '');
    const day = dayPlans.find(d => d.id === dayId);
    if (!day) return;

    const activities = [...day.activities];
    const [removed] = activities.splice(source.index, 1);
    activities.splice(destination.index, 0, removed);

    handleDayPlanUpdate({
      ...day,
      activities
    });
  };

  const handleAddActivity = (activity: string) => {
    let targetDayId = selectedDayId;
    
    // If no day is selected, use the first day as fallback
    if (!targetDayId && dayPlans.length > 0) {
      targetDayId = dayPlans[0].id;
      setSelectedDayId(targetDayId);
    }

    // Only proceed if we have a valid day ID
    if (!targetDayId) {
      console.error('No valid day selected for activity');
      return;
    }

    setDayPlans(currentPlans =>
      currentPlans.map(day =>
        day.id === targetDayId
          ? { ...day, activities: [...day.activities, activity] }
          : day
      )
    );
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', format(date, 'yyyy-MM-dd'));
    const normalizedDate = startOfDay(date);
    
    // Find day with matching date
    const selectedDay = dayPlans.find(day => 
      isSameDay(startOfDay(day.date), normalizedDate)
    );
    
    console.log('Found day:', selectedDay);
    
    if (selectedDay) {
      setSelectedDayId(selectedDay.id);
      // If in list view, switch to calendar view to show selection
      if (viewMode === 'list') {
        setViewMode('calendar');
      }
    } else {
      console.warn('No matching day found for selected date:', format(normalizedDate, 'yyyy-MM-dd'));
    }
  };

  // Find the selected day's information
  const selectedDay = dayPlans.find(day => day.id === selectedDayId);

  // Toggle map view function
  const toggleMapView = () => {
    if (selectedDay) {
      setShowMap(!showMap);
      
      // Scroll to map if showing it
      if (!showMap) {
        setTimeout(() => {
          const mapElement = document.getElementById('day-map-view');
          if (mapElement) {
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    console.log('View mode changed to:', viewMode);
    console.log('Current trip details:', tripDetails);
    console.log('Current day plans:', dayPlans);
  }, [viewMode]);

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className={`text-5xl font-bold text-center ${colors.accent} mb-12`}>
          Trip Planner
        </h1>

        {!dayPlans.length ? (
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute top-40 -right-20 w-60 h-60 bg-amber-100 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-100 rounded-full opacity-60 blur-xl"></div>
              
              {/* Animated travel icons */}
              <div className="absolute top-10 right-10">
                <span className="text-4xl inline-block animate-bounce">✈️</span>
              </div>
              <div className="absolute bottom-20 right-20">
                <span className="text-3xl inline-block animate-pulse">🌴</span>
              </div>
              <div className="absolute top-40 left-10">
                <span className="text-3xl inline-block animate-wiggle">🧳</span>
              </div>
              <div className="absolute bottom-40 left-40">
                <span className="text-3xl inline-block animate-pulse">🗺️</span>
              </div>
              
              <div className={`${colors.card} p-8 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-2xl relative z-10 transform hover:-translate-y-1 border-t-4 ${colors.accent}`}>
                <div className="text-center mb-8">
                  <h2 className={`text-3xl font-bold mb-2 ${colors.text}`}>Plan Your Dream Trip</h2>
                  <p className={`${colors.textSecondary} max-w-md mx-auto`}>Enter your destination and travel dates to start planning your perfect adventure.</p>
                </div>
                
                <form onSubmit={handleTripDetailsSubmit} className="space-y-8">
                  <div className="relative">
                    <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                      Where are you going?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🌎</span>
                      <input
                        type="text"
                        className={`w-full p-3 pl-10 ${colors.border} border rounded-lg focus:ring-2 ${colors.highlight} transition-all duration-300 text-lg`}
                        value={tripDetails.destination}
                        onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
                        required
                        placeholder="e.g., Paris, Tokyo, New York"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                        When does your trip start?
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📅</span>
                        <input
                          type="date"
                          className={`w-full p-3 pl-10 ${colors.border} border rounded-lg focus:ring-2 ${colors.highlight} transition-all duration-300`}
                          value={format(tripDetails.startDate, 'yyyy-MM-dd')}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                            setTripDetails(prev => ({
                              ...prev,
                              startDate: localDate,
                              endDate: prev.endDate < localDate ? localDate : prev.endDate
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`}>
                        When does your trip end?
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">📅</span>
                        <input
                          type="date"
                          className={`w-full p-3 pl-10 ${colors.border} border rounded-lg focus:ring-2 ${colors.highlight} transition-all duration-300`}
                          value={format(tripDetails.endDate, 'yyyy-MM-dd')}
                          min={format(tripDetails.startDate, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                            setTripDetails(prev => ({
                              ...prev,
                              endDate: localDate
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wider">Choose a theme for your trip</h3>
                      <div className="flex flex-wrap gap-3 mt-3 justify-center">
                        {[
                          { id: 'beach', name: 'Beach', icon: '🏖️' },
                          { id: 'mountain', name: 'Mountain', icon: '🏔️' },
                          { id: 'city', name: 'City', icon: '🌆' },
                          { id: 'classic', name: 'Classic', icon: '✈️' }
                        ].map((themeOption) => (
                          <button
                            key={themeOption.id}
                            type="button"
                            onClick={() => setTheme(themeOption.id as any)}
                            className={`
                              py-2 px-4 rounded-full flex items-center gap-2
                              ${theme === themeOption.id ? `${colors.secondary} ${colors.accent} ring-2 ring-offset-2 ${colors.highlight}` : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
                              transition-all duration-200 transform hover:scale-105
                            `}
                          >
                            <span className="text-xl">{themeOption.icon}</span>
                            <span className="font-medium">{themeOption.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`
                      w-full px-6 py-4 rounded-lg font-medium text-lg transition-all duration-300 
                      transform hover:scale-[1.02] active:scale-[0.98] ${colors.buttonPrimary}
                      shadow-md hover:shadow-lg flex items-center justify-center gap-2
                    `}
                  >
                    <span>Create My Trip Plan</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </form>
              </div>
              
              {/* Inspirational quotes section */}
              <div className="mt-8 text-center">
                <div className={`${colors.card} p-6 rounded-xl shadow-md inline-block max-w-lg`}>
                  <p className="italic text-gray-600">
                    "Travel isn't always pretty. It isn't always comfortable. Sometimes it hurts, it even breaks your heart. But that's okay. The journey changes you; it should change you."
                  </p>
                  <p className="mt-2 font-medium text-gray-800">— Anthony Bourdain</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <DestinationImage destination={tripDetails.destination} />
            
            <WeatherForecast 
              destination={tripDetails.destination}
              startDate={tripDetails.startDate}
              endDate={tripDetails.endDate}
            />
            
            <LanguagePhrasebook destination={tripDetails.destination} />
            
            <EmergencyInfo destination={tripDetails.destination} />
            
            <TripOverview tripDetails={tripDetails} />

            <Countdown targetDate={tripDetails.startDate} />

            {/* Show map view for the selected day only when requested */}
            {selectedDay && showMap && (
              <div id="day-map-view">
                <DayMapView
                  day={selectedDay}
                  destination={tripDetails.destination}
                  onUpdateActivities={(activities) => handleUpdateActivities(selectedDay.id, activities)}
                />
              </div>
            )}

            <div className="flex justify-end mb-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    viewMode === 'list'
                      ? `${colors.secondary} ${colors.accent} ${colors.border}`
                      : `${colors.card} ${colors.text} ${colors.border} hover:${colors.cardHover}`
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                    viewMode === 'calendar'
                      ? `${colors.secondary} ${colors.accent} ${colors.border}`
                      : `${colors.card} ${colors.text} ${colors.border} hover:${colors.cardHover}`
                  }`}
                >
                  Calendar View
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow">
                {viewMode === 'calendar' ? (
                  <div className="space-y-6">
                    <div className={`${colors.card} p-6 rounded-lg shadow-md`}>
                      <div className={`${colors.text} mb-4 flex justify-between items-center`}>
                        <span>Trip: {format(tripDetails.startDate, 'MMM d, yyyy')} - {format(tripDetails.endDate, 'MMM d, yyyy')}</span>
                      </div>
                      <CalendarView
                        startDate={tripDetails.startDate}
                        endDate={tripDetails.endDate}
                        onSelectDate={handleDateSelect}
                        selectedDate={selectedDay?.date}
                      />
                    </div>
                    {selectedDayId && dayPlans.length > 0 && (
                      <DayPlanner
                        day={dayPlans.find(day => day.id === selectedDayId)!}
                        onUpdate={handleDayPlanUpdate}
                        isSelected={true}
                        onViewMap={toggleMapView}
                      />
                    )}
                  </div>
                ) : (
                  <Droppable droppableId="days" type="day">
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-6"
                      >
                        {dayPlans.map((day, index) => (
                          <DayPlanner
                            key={day.id}
                            day={day}
                            onUpdate={handleDayPlanUpdate}
                            isSelected={day.id === selectedDayId}
                            onSelect={() => setSelectedDayId(day.id)}
                            index={index}
                            onViewMap={toggleMapView}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
              
              <div className="lg:w-1/4">
                <div className="sticky top-8 space-y-4">
                  {selectedDay && (
                    <div className={`${colors.card} p-4 rounded-lg shadow-md mb-4 transition-all duration-300 transform ${colors.highlight} border-l-4`}>
                      <h3 className={`text-lg font-semibold ${colors.text} mb-2 flex items-center`}>
                        <span className="mr-2">{selectedDay.icon}</span>
                        Selected Day
                      </h3>
                      <p className={`${colors.text} font-medium`}>
                        {format(selectedDay.date, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className={`${colors.textSecondary} text-sm mt-1`}>
                        {selectedDay.activities.length} {selectedDay.activities.length === 1 ? 'activity' : 'activities'} planned
                      </p>
                      <div className="mt-3 flex justify-between">
                        {viewMode === 'calendar' && (
                          <button 
                            onClick={() => setViewMode('list')}
                            className={`text-sm ${colors.accent} hover:underline flex items-center`}
                          >
                            <span>View all days</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={toggleMapView}
                          className={`text-sm ${colors.accent} hover:underline flex items-center`}
                        >
                          <span>{showMap ? 'Hide map' : 'Show map'}</span>
                          <span className="ml-1">{showMap ? '🗺️' : '🗺️'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                  <ActivitySuggestions
                    destination={tripDetails.destination}
                    onAddActivity={handleAddActivity}
                  />
                </div>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>

      <ThemeSwitcher />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 