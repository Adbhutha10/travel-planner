import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface WeatherForecastProps {
  destination: string;
  startDate: Date;
  endDate: Date;
}

interface WeatherData {
  date: Date;
  temperature: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ destination, startDate, endDate }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const { colors } = useTheme();

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!destination) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Convert destination to coordinates (geocoding)
        // In a real app, we would use a geocoding API to get lat/long
        // For demo purposes, we'll generate mock weather data
        
        const mockWeatherData: WeatherData[] = [];
        let currentDate = new Date(startDate);
        
        const weatherConditions = [
          { condition: 'Sunny', icon: '☀️' },
          { condition: 'Partly Cloudy', icon: '⛅' },
          { condition: 'Cloudy', icon: '☁️' },
          { condition: 'Rain', icon: '🌧️' },
          { condition: 'Thunderstorm', icon: '⛈️' },
          { condition: 'Snow', icon: '❄️' },
          { condition: 'Fog', icon: '🌫️' }
        ];
        
        // Generate weather for each day of the trip
        while (isBefore(currentDate, addDays(endDate, 1))) {
          const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
          const minTemp = 10; // Celsius
          const maxTemp = 30; // Celsius
          const temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;
          
          mockWeatherData.push({
            date: new Date(currentDate),
            temperature,
            condition: randomCondition.condition,
            icon: randomCondition.icon,
            humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
            windSpeed: Math.floor(Math.random() * 30) + 5 // 5-35 km/h
          });
          
          currentDate = addDays(currentDate, 1);
        }
        
        // In a real implementation, we would make an API call:
        // const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        // const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${destination}&days=10`);
        // const data = await response.json();
        
        setWeatherData(mockWeatherData);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [destination, startDate, endDate]);

  const convertTemp = (celsius: number): number => {
    if (tempUnit === 'C') return celsius;
    return Math.round(celsius * 9/5 + 32);
  };

  if (!destination) {
    return null;
  }

  return (
    <div className={`${colors.card} p-6 rounded-lg shadow-md mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold ${colors.text} flex items-center`}>
          <span className="mr-2">🌤️</span>
          Weather Forecast for {destination}
        </h3>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTempUnit('C')}
            className={`px-2 py-1 rounded-l-md text-xs font-medium ${
              tempUnit === 'C' 
                ? `${colors.secondary} ${colors.accent}` 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setTempUnit('F')}
            className={`px-2 py-1 rounded-r-md text-xs font-medium ${
              tempUnit === 'F' 
                ? `${colors.secondary} ${colors.accent}` 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            °F
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading forecast...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-1">
            Weather data couldn't be loaded. Please try again later.
          </p>
        </div>
      )}
      
      {!loading && !error && weatherData.length > 0 && (
        <div className="overflow-x-auto">
          <div className="inline-flex space-x-4 pb-2 min-w-full">
            {weatherData.map((day, index) => (
              <div 
                key={index} 
                className={`min-w-[120px] ${colors.secondary} p-4 rounded-lg transition-transform duration-200 transform hover:scale-105 text-center ${index === 0 ? `${colors.highlight} border-2` : ''}`}
              >
                <p className={`text-sm font-medium ${colors.textSecondary} mb-1`}>
                  {format(day.date, 'EEE')}
                </p>
                <p className={`text-xs ${colors.textSecondary}`}>
                  {format(day.date, 'MMM d')}
                </p>
                <div className="text-4xl my-3">{day.icon}</div>
                <p className={`text-lg font-bold ${colors.text}`}>
                  {convertTemp(day.temperature)}°{tempUnit}
                </p>
                <p className={`text-xs ${colors.textSecondary} mt-1`}>
                  {day.condition}
                </p>
                {day.humidity && day.windSpeed && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                    <div className="flex justify-between items-center">
                      <span>💧 {day.humidity}%</span>
                      <span>💨 {day.windSpeed} km/h</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>* Weather forecast is simulated for demonstration purposes</p>
      </div>
    </div>
  );
};

export default WeatherForecast; 