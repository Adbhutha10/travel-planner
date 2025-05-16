import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ActivityMapButtonProps {
  onClick: () => void;
  activityCount: number;
}

const ActivityMapButton: React.FC<ActivityMapButtonProps> = ({ onClick, activityCount }) => {
  const { colors } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`${colors.buttonSecondary} text-sm px-3 py-1 rounded-lg flex items-center transition-all hover:shadow-md`}
      title="View activities on map"
    >
      <span className="mr-1">🗺️</span>
      <span>View on Map</span>
      {activityCount > 0 && (
        <span className={`ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
          {activityCount}
        </span>
      )}
    </button>
  );
};

export default ActivityMapButton; 