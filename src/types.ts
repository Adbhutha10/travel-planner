export interface Activity {
  title: string;
  description: string;
  category: 'Sightseeing' | 'Food & Drink' | 'Culture' | 'Adventure' | 'Shopping';
  duration: string;
  popular?: boolean;
  location?: string;
}

export interface MapActivity {
  title: string;
  location?: string;
  time?: string;
  index?: number | string;
  isAutoDetected?: boolean;
}

export interface TripDetails {
  destination: string;
  startDate: Date;
  endDate: Date;
}

export interface DayPlanActivity {
  text: string;
  location?: string;
  time?: string;
}

export interface DayPlan {
  id: string;
  date: Date;
  activities: string[];  // Keep as string[] for backward compatibility
  notes: string;
  icon?: string;
} 