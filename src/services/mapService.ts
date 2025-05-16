import { MapActivity, DayPlan, DayPlanActivity } from '../types';

// Helper function to parse activity string into a proper activity object
export const parseActivityString = (activity: string): DayPlanActivity => {
  // Look for location indicators
  const locationMatch = activity.match(/\[at: (.*?)\]/i);
  const location = locationMatch ? locationMatch[1] : undefined;
  
  // Look for time indicators
  const timeMatch = activity.match(/\[time: (.*?)\]/i);
  const time = timeMatch ? timeMatch[1] : undefined;
  
  // Clean up the activity text
  let text = activity
    .replace(/\[at: (.*?)\]/gi, '')
    .replace(/\[time: (.*?)\]/gi, '')
    .trim();
  
  return {
    text,
    location,
    time
  };
};

// Convert day plan activities to map activities
export const dayPlanToMapActivities = (dayPlan: DayPlan): MapActivity[] => {
  if (!dayPlan.activities || dayPlan.activities.length === 0) {
    return [];
  }
  
  return dayPlan.activities.map((activity, index) => {
    // Parse the activity string to extract location and time
    const parsedActivity = parseActivityString(activity);
    
    // If no explicit location is provided, try to extract one from the activity text
    let location = parsedActivity.location;
    if (!location) {
      location = extractPossibleLocation(parsedActivity.text);
    }
    
    return {
      title: parsedActivity.text,
      location: location,
      time: parsedActivity.time,
      index: index + 1,
      isAutoDetected: !parsedActivity.location && location !== undefined
    };
  });
};

// Known landmarks and attractions for common destinations
const cityLandmarks: Record<string, string[]> = {
  'Paris': [
    'Eiffel Tower', 'Louvre', 'Notre Dame', 'Arc de Triomphe', 'Montmartre', 
    'Champs-Élysées', 'Seine', 'Sacré-Cœur', 'Panthéon', 'Musée d\'Orsay',
    'Versailles', 'Tuileries', 'Pompidou', 'Luxembourg Gardens'
  ],
  'London': [
    'Big Ben', 'Tower of London', 'Buckingham Palace', 'London Eye', 'British Museum',
    'Westminster Abbey', 'Hyde Park', 'St. Paul\'s Cathedral', 'Trafalgar Square',
    'Piccadilly Circus', 'Covent Garden', 'Tate Modern', 'Thames'
  ],
  'New York': [
    'Times Square', 'Central Park', 'Empire State Building', 'Statue of Liberty',
    'Brooklyn Bridge', 'Broadway', 'Fifth Avenue', 'Museum of Modern Art', 'MoMA',
    'Grand Central', 'Rockefeller Center', 'Wall Street', 'High Line'
  ],
  'Tokyo': [
    'Tokyo Tower', 'Shibuya', 'Shinjuku', 'Ginza', 'Akihabara', 'Imperial Palace',
    'Meiji Shrine', 'Harajuku', 'Asakusa', 'Senso-ji', 'Ueno Park', 'Tokyo Skytree'
  ],
  'Rome': [
    'Colosseum', 'Vatican', 'Trevi Fountain', 'Pantheon', 'Spanish Steps',
    'Roman Forum', 'St. Peter\'s Basilica', 'Sistine Chapel', 'Piazza Navona'
  ]
};

// Extract location from activity text - used for activities without explicit location tags
export const extractPossibleLocation = (text: string): string | undefined => {
  // First check for landmarks based on full text matching
  for (const city in cityLandmarks) {
    for (const landmark of cityLandmarks[city]) {
      if (text.toLowerCase().includes(landmark.toLowerCase())) {
        return landmark;
      }
    }
  }
  
  // Common location prefixes
  const prefixes = [
    'at', 'in', 'to', 'visit', 'visiting', 'go to', 'going to', 'explore', 'exploring',
    'see', 'seeing', 'tour', 'touring', 'walk', 'walking around'
  ];
  
  // Try to match phrases like "Visit the Eiffel Tower"
  for (const prefix of prefixes) {
    // Create a pattern like "visit(?:ing)?\s+(?:the\s+)?([\w\s-']+)"
    const regex = new RegExp(`${prefix}(?:ing)?\\s+(?:the\\s+)?(([\\w\\s-']+)(\\s+in\\s+[\\w\\s]+)?)`, 'i');
    const match = text.match(regex);
    if (match && match[1] && match[1].length > 3) {
      // We found something like "Eiffel Tower in Paris" - extract just "Eiffel Tower"
      return match[2] || match[1];
    }
  }
  
  // If we have words like "museum", "park", "tower", extract them with context
  const landmarkTypes = ['museum', 'park', 'tower', 'palace', 'castle', 'cathedral', 'temple', 
                   'garden', 'square', 'market', 'bridge', 'monument', 'statue'];
  
  for (const landmarkType of landmarkTypes) {
    if (text.toLowerCase().includes(landmarkType)) {
      const regex = new RegExp(`([\\w\\s-']+${landmarkType}[\\w\\s-']*)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  
  return undefined;
};

// Format activity for display, including location and time tags
export const formatActivityWithTags = (activity: DayPlanActivity): string => {
  let result = activity.text;
  
  if (activity.location) {
    result += ` [at: ${activity.location}]`;
  }
  
  if (activity.time) {
    result += ` [time: ${activity.time}]`;
  }
  
  return result;
};

// Add location information to an activity string
export const addLocationToActivity = (activity: string, location: string): string => {
  const parsed = parseActivityString(activity);
  parsed.location = location;
  return formatActivityWithTags(parsed);
};

// Update location for an activity string
export const updateLocationInActivity = (activity: string, newLocation: string): string => {
  const parsed = parseActivityString(activity);
  parsed.location = newLocation;
  return formatActivityWithTags(parsed);
}; 