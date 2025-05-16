import React, { useState } from 'react';
import { format, addDays, isSameMonth, isSameDay, addMonths, subMonths, startOfMonth } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface CalendarViewProps {
  startDate: Date;
  endDate: Date;
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  startDate,
  endDate,
  onSelectDate,
  selectedDate
}) => {
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [animateDirection, setAnimateDirection] = useState<'left' | 'right' | null>(null);
  
  // Create a calendar grid
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const dates: Date[] = [];
  
  // Get first day of month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Fill in leading empty days
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevMonthDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0 - i);
    dates.unshift(prevMonthDay);
  }
  
  // Fill with dates from current month and a bit of next month to complete grid
  for (let i = 0; i < 42 - firstDayOfMonth; i++) {
    dates.push(addDays(monthStart, i));
  }
  
  // Handle month navigation with animation
  const goToPrevMonth = () => {
    setAnimateDirection('right');
    setTimeout(() => {
      setCurrentMonth(prev => subMonths(prev, 1));
      setAnimateDirection(null);
    }, 200);
  };
  
  const goToNextMonth = () => {
    setAnimateDirection('left');
    setTimeout(() => {
      setCurrentMonth(prev => addMonths(prev, 1));
      setAnimateDirection(null);
    }, 200);
  };
  
  return (
    <div className={`${colors.card} p-5 rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl`}>
      {/* Month header with animations */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={goToPrevMonth}
          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 hover:${colors.accent} focus:outline-none`}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={colors.text}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={`text-2xl font-bold ${colors.text} transform transition-all duration-300
          ${animateDirection === 'left' ? 'opacity-0 -translate-x-8' : ''}
          ${animateDirection === 'right' ? 'opacity-0 translate-x-8' : ''}
        `}>
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={goToNextMonth}
          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 hover:${colors.accent} focus:outline-none`}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={colors.text}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className={`text-center font-medium text-sm py-2 ${colors.textSecondary}`}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid with animations */}
      <div className={`grid grid-cols-7 gap-1 transform transition-all duration-300
        ${animateDirection === 'left' ? 'opacity-0 -translate-x-4' : ''}
        ${animateDirection === 'right' ? 'opacity-0 translate-x-4' : ''}
      `}>
        {dates.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isInRange = date >= startDate && date <= endDate;
            
          return (
            <button
              key={index}
              onClick={() => isInRange && onSelectDate && onSelectDate(date)}
              disabled={!isInRange}
              className={`
                relative p-2 h-12 text-center rounded-md transition-all duration-200
                ${isCurrentMonth ? colors.text : `${colors.textSecondary} opacity-30`}
                ${isSelected ? `${colors.secondary} font-bold ring-2 ${colors.highlight}` : ''}
                ${isToday ? 'font-bold' : ''}
                ${isInRange && isCurrentMonth ? `hover:${colors.cardHover} hover:scale-110 hover:z-10` : ''}
                disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100
                transform origin-center
              `}
            >
              <span className="relative z-10">{format(date, 'd')}</span>
              
              {/* Today indicator */}
              {isToday && (
                <span className={`absolute inset-0 bg-transparent border-2 ${colors.accent} rounded-md opacity-70`}></span>
              )}
              
              {/* Selected indicator */}
              {isSelected && (
                <span className={`absolute inset-0 ${colors.secondary} rounded-md opacity-30`}></span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Current selection indicator */}
      {selectedDate && (
        <div className={`mt-4 pt-3 border-t ${colors.border} text-center ${colors.text}`}>
          Selected: <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 