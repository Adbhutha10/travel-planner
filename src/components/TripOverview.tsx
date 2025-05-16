import React from 'react';
import { formatDistance, isBefore, isAfter, differenceInDays } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';
import { TripDetails } from '../types';

interface TripOverviewProps {
  tripDetails: TripDetails;
}

const TripOverview: React.FC<TripOverviewProps> = ({ tripDetails }) => {
  const { destination, startDate, endDate } = tripDetails;
  const today = new Date();
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const { colors } = useTheme();
  
  // Calculate trip progress
  const calculateProgress = () => {
    if (isBefore(today, startDate)) return 0;
    if (isAfter(today, endDate)) return 100;
    
    const daysElapsed = differenceInDays(today, startDate);
    return Math.round((daysElapsed / totalDays) * 100);
  };

  const progress = calculateProgress();
  const durationText = formatDistance(startDate, endDate, { addSuffix: false });

  // Get status text and color
  const getStatusInfo = () => {
    if (isBefore(today, startDate)) {
      return {
        text: 'Upcoming',
        color: colors.accent,
        bgColor: colors.secondary
      };
    }
    if (isAfter(today, endDate)) {
      return {
        text: 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    }
    return {
      text: 'In Progress',
      color: colors.accent,
      bgColor: colors.secondary
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`${colors.card} rounded-xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1`}>
      {/* Background Pattern */}
      <div className={`relative h-28 ${colors.gradient}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: colors.pattern,
          }}/>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 -mt-14">
        <div className={`${colors.card} rounded-lg shadow-md p-6 border ${colors.border}`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">✈️</span>
                <h1 className={`text-2xl font-bold ${colors.text}`}>
                  {destination}
                </h1>
              </div>
              <div className="flex items-center text-sm mb-1">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className={`${colors.text} font-medium`}>
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={`${colors.textSecondary}`}>
                  Duration: <span className="font-medium">{durationText}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${status.color} ${status.bgColor} transform transition-transform hover:scale-105`}>
                {status.text}
              </span>
              <span className="text-sm mt-2 text-gray-500">
                {totalDays} {totalDays === 1 ? 'day' : 'days'} total
              </span>
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-3 rounded-lg ${colors.secondary} text-center`}>
              <div className="text-sm text-gray-500">Days</div>
              <div className={`text-xl font-bold ${colors.accent}`}>{totalDays}</div>
            </div>
            <div className={`p-3 rounded-lg ${colors.secondary} text-center`}>
              <div className="text-sm text-gray-500">Progress</div>
              <div className={`text-xl font-bold ${colors.accent}`}>{progress}%</div>
            </div>
            <div className={`p-3 rounded-lg ${colors.secondary} text-center`}>
              <div className="text-sm text-gray-500">Start</div>
              <div className={`text-xl font-bold ${colors.accent}`}>{startDate.getDate()}</div>
            </div>
            <div className={`p-3 rounded-lg ${colors.secondary} text-center`}>
              <div className="text-sm text-gray-500">End</div>
              <div className={`text-xl font-bold ${colors.accent}`}>{endDate.getDate()}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className={`text-sm font-semibold ${colors.accent} mr-2`}>
                  Trip Progress
                </span>
                {progress > 0 && progress < 100 && (
                  <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                )}
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold inline-block ${colors.accent}`}>
                  {progress}%
                </span>
              </div>
            </div>
            <div className={`overflow-hidden h-3 mb-1 text-xs flex rounded-full ${colors.secondary}`}>
              <div
                style={{ width: `${progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${colors.gradient} transition-all duration-1000 ease-in-out rounded-full`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripOverview; 