import React, { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeUnit: React.FC<{ value: number; label: string; glowColor: string }> = ({ 
  value, 
  label,
  glowColor 
}) => {
  const [animateValue, setAnimateValue] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const { colors } = useTheme();

  useEffect(() => {
    if (prevValue !== value) {
      setAnimateValue(true);
      const timer = setTimeout(() => setAnimateValue(false), 300);
      setPrevValue(value);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  const formattedValue = String(value).padStart(2, '0');
  const digits = formattedValue.split('');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex gap-1">
        {digits.map((digit, index) => (
          <div
            key={`${index}-${digit}`}
            className={`relative w-12 h-20 flex items-center justify-center 
              ${colors.card} rounded-lg overflow-hidden
              shadow-lg transition-transform duration-300
              ${animateValue ? 'scale-110' : 'scale-100'}
              border ${colors.border}`}
            style={{
              boxShadow: `0 0 20px ${glowColor}22`,
            }}
          >
            {/* Background gradient */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${glowColor}22, transparent 50%)`,
              }}
            />

            {/* Shine effect */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 55%, transparent)',
                transform: animateValue ? 'translateX(100%)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-out',
              }}
            />

            {/* Digit */}
            <span className={`relative text-3xl font-bold ${colors.text} transition-all duration-300
              ${animateValue ? 'transform -translate-y-1' : ''}`}>
              {digit}
            </span>

            {/* Top highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-px opacity-30"
              style={{ background: glowColor }}
            />

            {/* Bottom shadow */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 opacity-10"
              style={{ background: `linear-gradient(to bottom, ${glowColor}, transparent)` }}
            />
          </div>
        ))}
      </div>
      <span className={`text-sm font-medium ${colors.textSecondary}`}>{label}</span>
    </div>
  );
};

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { colors, theme } = useTheme();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      if (targetDate <= now) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      const seconds = differenceInSeconds(targetDate, now) % 60;

      return { days, hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  // Theme-specific glow colors
  const themeGlowColors: Record<string, string> = {
    beach: '#f97316', // Orange
    mountain: '#0ea5e9', // Sky blue
    city: '#a855f7', // Purple
    classic: '#3b82f6', // Blue
  };

  const glowColor = themeGlowColors[theme];

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className={`relative overflow-hidden rounded-xl mb-8 ${colors.card} p-8`}>
      {/* Background with theme-specific pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: colors.pattern }}
      />

      {/* Content */}
      <div className="relative">
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
            Time Until Your Adventure
          </h2>
          <div className={`h-1 w-20 mx-auto rounded-full ${colors.gradient}`} />
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {timeBlocks.map(({ label, value }) => (
            <TimeUnit 
              key={label} 
              label={label} 
              value={value}
              glowColor={glowColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countdown; 