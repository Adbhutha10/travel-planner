import React, { useState, useEffect } from 'react';
import { format, isToday, isFuture } from 'date-fns';
import { DayPlan } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import ActivityMapButton from './ActivityMapButton';
import { DragDropContext, Draggable, Droppable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

interface DayPlannerProps {
  day: DayPlan;
  onUpdate: (day: DayPlan) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  index?: number;
  onViewMap?: () => void;
}

interface RichTextButton {
  icon: string;
  command: string;
  style?: string;
}

const STORAGE_KEY_PREFIX = 'tripPlanner_day_';

const activityIcons = [
  { icon: '🏖️', label: 'Beach' },
  { icon: '🍴', label: 'Food' },
  { icon: '🏛️', label: 'Sightseeing' },
  { icon: '🏃', label: 'Activity' },
  { icon: '🎨', label: 'Culture' },
  { icon: '🛍️', label: 'Shopping' },
  { icon: '🎉', label: 'Entertainment' },
  { icon: '🌳', label: 'Nature' },
  { icon: '✈️', label: 'Travel' },
  { icon: '🏨', label: 'Accommodation' },
] as const;

const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const { colors } = useTheme();

  return (
    <div className={`border ${colors.border} rounded-md overflow-hidden ${colors.card}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 min-h-[100px] focus:outline-none ${colors.text} bg-transparent resize-y`}
      />
    </div>
  );
};

const DayPlanner: React.FC<DayPlannerProps> = ({ day, onUpdate, isSelected = false, onSelect, index, onViewMap }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const { colors } = useTheme();

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`${STORAGE_KEY_PREFIX}${day.id}`);
    if (savedNotes && savedNotes !== day.notes) {
      onUpdate({
        ...day,
        notes: savedNotes
      });
    }
  }, [day.id]);

  // Save notes to localStorage when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${day.id}`, day.notes);
    }, 500); // Debounce save to avoid too many writes

    return () => clearTimeout(timeoutId);
  }, [day.notes, day.id]);

  const handleIconSelect = (icon: string) => {
    onUpdate({
      ...day,
      icon: icon
    });
    setShowIconPicker(false);
  };

  const handleAddActivity = (activity: string) => {
    onUpdate({
      ...day,
      activities: [...day.activities, activity]
    });
  };

  const handleRemoveActivity = (index: number) => {
    onUpdate({
      ...day,
      activities: day.activities.filter((_, i) => i !== index)
    });
  };

  const handleMoveActivity = (fromIndex: number, toIndex: number) => {
    const activities = [...day.activities];
    const [removed] = activities.splice(fromIndex, 1);
    activities.splice(toIndex, 0, removed);
    onUpdate({
      ...day,
      activities
    });
  };

  const handleNotesChange = (newNotes: string) => {
    onUpdate({
      ...day,
      notes: newNotes
    });
  };

  const toggleExpand = () => {
    setIsAnimating(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getDayStatus = () => {
    if (isToday(day.date)) return 'today';
    if (isFuture(day.date)) return 'future';
    return 'past';
  };

  const statusStyles = {
    today: `ring-2 ${colors.highlight} ${colors.secondary}`,
    future: colors.card,
    past: `${colors.card} opacity-75`
  };

  return (
    <Draggable draggableId={day.id} index={index || 0} key={day.id}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`rounded-lg ${colors.shadow} transition-all duration-300 
            ${statusStyles[getDayStatus()]} 
            ${isSelected ? `ring-2 ${colors.highlight} transform scale-[1.01]` : ''} 
            ${isAnimating ? 'animate-card-expand' : ''}
            ${colors.cardHover}
            ${colors.border} border
            cursor-pointer
          `}
          onClick={() => onSelect && onSelect()}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div {...provided.dragHandleProps}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIconPicker(!showIconPicker);
                    }}
                    className={`text-2xl hover:scale-110 transition-transform duration-200 ${colors.text}`}
                  >
                    {day.icon || '📅'}
                  </button>
                  
                  {showIconPicker && (
                    <div className={`absolute mt-2 p-2 ${colors.card} rounded-lg ${colors.shadow} border ${colors.border} grid grid-cols-5 gap-2 z-10`}>
                      {activityIcons.map((item) => (
                        <button
                          key={item.icon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIconSelect(item.icon);
                          }}
                          className={`p-2 ${colors.cardHover} rounded transition-colors duration-200`}
                          title={item.label}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className={`text-xl font-semibold ${colors.text}`}>
                    {format(day.date, 'EEEE, MMMM d')}
                  </h3>
                  {isToday(day.date) && (
                    <span className={`text-sm font-medium ${colors.accent}`}>Today</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Map Button */}
                {onViewMap && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActivityMapButton 
                      onClick={() => {
                        // First ensure this day is selected
                        if (onSelect) onSelect();
                        // Then trigger map view
                        onViewMap();
                      }} 
                      activityCount={day.activities.length}
                    />
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand();
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${colors.cardHover} transition-transform duration-300
                    ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <svg
                    className={`w-5 h-5 ${colors.textSecondary}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div 
              className={`space-y-4 transition-all duration-300 ease-in-out
                ${isExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
            >
              <div>
                <h4 className={`font-medium mb-2 flex items-center justify-between ${colors.text}`}>
                  <span>Activities</span>
                  <span className={`text-sm ${colors.textSecondary}`}>
                    {day.activities.length} planned
                  </span>
                </h4>
                {day.activities.length === 0 ? (
                  <p className={`text-sm italic ${colors.textSecondary}`}>No activities planned yet</p>
                ) : (
                  <Droppable droppableId={`activities-${day.id}`}>
                    {(dropProvided: DroppableProvided) => (
                      <ul
                        {...dropProvided.droppableProps}
                        ref={dropProvided.innerRef}
                        className="space-y-2"
                      >
                        {day.activities.map((activity, activityIndex) => (
                          <Draggable
                            key={`${day.id}-activity-${activityIndex}`}
                            draggableId={`${day.id}-activity-${activityIndex}`}
                            index={activityIndex}
                          >
                            {(dragProvided: DraggableProvided) => (
                              <li
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`flex items-center justify-between p-2 ${colors.card} rounded border ${colors.border}
                                  ${colors.cardHover} transition-colors duration-200`}
                              >
                                <span className={colors.text}>{activity}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveActivity(activityIndex);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 
                                    rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-200"
                                >
                                  ×
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {dropProvided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                )}
              </div>

              <div>
                <h4 className={`font-medium mb-2 ${colors.text}`}>Notes</h4>
                <div onClick={(e) => e.stopPropagation()}>
                  <RichTextEditor
                    value={day.notes}
                    onChange={handleNotesChange}
                    placeholder="Add any notes for this day..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DayPlanner; 