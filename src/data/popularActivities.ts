import { Activity } from '../types';

interface ActivityDatabase {
  [destination: string]: Activity[];
}

export const popularActivities: ActivityDatabase = {
  'Paris': [
    {
      title: 'Visit the Eiffel Tower',
      description: 'Climb to the top of the iconic Eiffel Tower for panoramic views of the city.',
      category: 'Sightseeing',
      duration: '3 hours',
      popular: true
    },
    {
      title: 'Louvre Museum Tour',
      description: 'Explore world-famous artworks including the Mona Lisa.',
      category: 'Culture',
      duration: '4 hours',
      popular: true
    },
    {
      title: 'Seine River Cruise',
      description: 'Take a romantic boat ride along the Seine River.',
      category: 'Sightseeing',
      duration: '1 hour'
    },
    {
      title: 'French Cooking Class',
      description: 'Learn to make classic French dishes with a professional chef.',
      category: 'Food & Drink',
      duration: '3 hours',
      popular: true
    },
    {
      title: 'Shopping at Champs-Élysées',
      description: 'Explore luxury boutiques and shops on this famous avenue.',
      category: 'Shopping',
      duration: '4 hours'
    },
    {
      title: 'Visit Montmartre',
      description: 'Explore the artistic neighborhood and visit Sacré-Cœur Basilica.',
      category: 'Culture',
      duration: '3 hours'
    },
    {
      title: 'Wine Tasting Experience',
      description: 'Sample fine French wines with expert sommeliers.',
      category: 'Food & Drink',
      duration: '2 hours'
    },
    {
      title: 'Palace of Versailles Day Trip',
      description: 'Visit the magnificent royal palace and its gardens.',
      category: 'Sightseeing',
      duration: 'Full day'
    }
  ],
  'Tokyo': [
    {
      title: 'Explore Shibuya Crossing',
      description: 'Experience the world\'s busiest pedestrian crossing.',
      category: 'Sightseeing',
      duration: '1 hour',
      popular: true
    },
    {
      title: 'Sushi Making Class',
      description: 'Learn to make authentic Japanese sushi with local chefs.',
      category: 'Food & Drink',
      duration: '2 hours',
      popular: true
    },
    {
      title: 'Senso-ji Temple Visit',
      description: 'Visit Tokyo\'s oldest Buddhist temple.',
      category: 'Culture',
      duration: '2 hours'
    },
    {
      title: 'Anime Shopping in Akihabara',
      description: 'Explore the electronics and anime district.',
      category: 'Shopping',
      duration: '3 hours'
    },
    {
      title: 'Robot Restaurant Show',
      description: 'Experience the unique high-tech entertainment show.',
      category: 'Culture',
      duration: '2 hours'
    },
    {
      title: 'Meiji Shrine Visit',
      description: 'Explore the peaceful forested shrine in the heart of Tokyo.',
      category: 'Culture',
      duration: '2 hours'
    },
    {
      title: 'Harajuku Fashion District',
      description: 'Discover Japan\'s youth fashion culture and trendy boutiques.',
      category: 'Shopping',
      duration: '3 hours'
    },
    {
      title: 'Tokyo Skytree',
      description: 'Visit one of the world\'s tallest towers for breathtaking views.',
      category: 'Sightseeing',
      duration: '2 hours'
    }
  ],
  'New York': [
    {
      title: 'Visit Times Square',
      description: 'Experience the bright lights and energy of this iconic location.',
      category: 'Sightseeing',
      duration: '2 hours',
      popular: true
    },
    {
      title: 'Empire State Building',
      description: 'Take in panoramic views from this famous skyscraper.',
      category: 'Sightseeing',
      duration: '2 hours'
    },
    {
      title: 'Central Park Bike Tour',
      description: 'Cycle through Manhattan\'s urban oasis.',
      category: 'Adventure',
      duration: '3 hours',
      popular: true
    },
    {
      title: 'Broadway Show',
      description: 'Watch a world-class theatrical performance.',
      category: 'Culture',
      duration: '3 hours'
    },
    {
      title: 'Food Tour in Brooklyn',
      description: 'Sample diverse cuisines across Brooklyn\'s neighborhoods.',
      category: 'Food & Drink',
      duration: '4 hours'
    },
    {
      title: 'Shopping in SoHo',
      description: 'Explore trendy boutiques and designer stores.',
      category: 'Shopping',
      duration: '3 hours'
    },
    {
      title: 'Museum of Modern Art',
      description: 'View famous works of contemporary and modern art.',
      category: 'Culture',
      duration: '3 hours'
    }
  ],
  'Rome': [
    {
      title: 'Colosseum Tour',
      description: 'Explore the ancient Roman amphitheater with a guided tour.',
      category: 'Sightseeing',
      duration: '3 hours',
      popular: true
    },
    {
      title: 'Vatican Museums & Sistine Chapel',
      description: 'See Michelangelo\'s masterpiece and incredible art collections.',
      category: 'Culture',
      duration: '4 hours',
      popular: true
    },
    {
      title: 'Roman Pasta Making Class',
      description: 'Learn to make authentic carbonara, cacio e pepe, and amatriciana.',
      category: 'Food & Drink',
      duration: '3 hours'
    },
    {
      title: 'Trevi Fountain Visit',
      description: 'Toss a coin in the famous baroque fountain.',
      category: 'Sightseeing',
      duration: '1 hour'
    },
    {
      title: 'Shopping at Via del Corso',
      description: 'Explore Rome\'s main shopping street.',
      category: 'Shopping',
      duration: '3 hours'
    },
    {
      title: 'Roman Forum Walk',
      description: 'Stroll through the heart of ancient Rome.',
      category: 'Sightseeing',
      duration: '2 hours'
    }
  ],
  'Barcelona': [
    {
      title: 'Sagrada Familia Tour',
      description: 'Explore Gaudí\'s unfinished masterpiece with a guided tour.',
      category: 'Sightseeing',
      duration: '2 hours'
    },
    {
      title: 'Tapas Hopping',
      description: 'Sample various Spanish tapas at local bars.',
      category: 'Food & Drink',
      duration: '3 hours'
    },
    {
      title: 'Park Güell Visit',
      description: 'Discover Gaudí\'s whimsical park with mosaic works.',
      category: 'Sightseeing',
      duration: '2 hours'
    },
    {
      title: 'Gothic Quarter Walking Tour',
      description: 'Explore the historic center of Barcelona.',
      category: 'Culture',
      duration: '2 hours'
    },
    {
      title: 'Cooking Workshop',
      description: 'Learn to prepare authentic paella and sangria.',
      category: 'Food & Drink',
      duration: '3 hours'
    },
    {
      title: 'La Boqueria Market',
      description: 'Explore Barcelona\'s famous food market.',
      category: 'Food & Drink',
      duration: '1 hour'
    }
  ],
  'London': [
    {
      title: 'Tower of London Tour',
      description: 'Discover the historic castle and see the Crown Jewels.',
      category: 'Culture',
      duration: '3 hours'
    },
    {
      title: 'London Eye Experience',
      description: 'Enjoy panoramic views from the giant observation wheel.',
      category: 'Sightseeing',
      duration: '1 hour'
    },
    {
      title: 'British Museum Visit',
      description: 'Explore one of the world\'s most comprehensive museums.',
      category: 'Culture',
      duration: '3 hours'
    },
    {
      title: 'West End Show',
      description: 'Watch a world-famous theatrical performance.',
      category: 'Culture',
      duration: '3 hours'
    },
    {
      title: 'Shopping in Covent Garden',
      description: 'Explore shops and watch street performers in this historic area.',
      category: 'Shopping',
      duration: '3 hours'
    },
    {
      title: 'Afternoon Tea',
      description: 'Experience traditional British afternoon tea at a luxury hotel.',
      category: 'Food & Drink',
      duration: '2 hours'
    }
  ],
  'Bangkok': [
    {
      title: 'Grand Palace Tour',
      description: 'Explore the former royal residence and Wat Phra Kaew temple.',
      category: 'Sightseeing',
      duration: '3 hours'
    },
    {
      title: 'Thai Cooking Class',
      description: 'Learn to prepare authentic Thai dishes with local ingredients.',
      category: 'Food & Drink',
      duration: '4 hours'
    },
    {
      title: 'Chatuchak Weekend Market',
      description: 'Shop at one of the world\'s largest weekend markets.',
      category: 'Shopping',
      duration: '4 hours'
    },
    {
      title: 'Chao Phraya River Cruise',
      description: 'See Bangkok\'s landmarks from the water.',
      category: 'Sightseeing',
      duration: '2 hours'
    },
    {
      title: 'Street Food Tour',
      description: 'Sample delicious Thai street food with a knowledgeable guide.',
      category: 'Food & Drink',
      duration: '3 hours'
    },
    {
      title: 'Wat Arun Visit',
      description: 'Explore the stunning Temple of Dawn along the river.',
      category: 'Culture',
      duration: '2 hours'
    }
  ]
};

// Function to generate generic activities for destinations not in our database
export const generateGenericActivities = (destination: string): Activity[] => {
  return [
    {
      title: `Explore ${destination} City Center`,
      description: `Discover the heart of ${destination} and its main attractions.`,
      category: 'Sightseeing',
      duration: '3 hours',
      popular: true
    },
    {
      title: 'Local Food Tour',
      description: `Taste the best local cuisine ${destination} has to offer.`,
      category: 'Food & Drink',
      duration: '4 hours',
      popular: true
    },
    {
      title: 'Cultural Experience',
      description: `Immerse yourself in ${destination}'s rich cultural heritage.`,
      category: 'Culture',
      duration: '2 hours'
    },
    {
      title: 'Shopping District Tour',
      description: `Explore the best shopping areas in ${destination}.`,
      category: 'Shopping',
      duration: '3 hours'
    },
    {
      title: 'Adventure Activity',
      description: `Experience exciting outdoor activities in ${destination}.`,
      category: 'Adventure',
      duration: '4 hours',
      popular: true
    },
    {
      title: 'Historical Landmarks Tour',
      description: `Visit important historical sites in ${destination}.`,
      category: 'Culture',
      duration: '3 hours'
    },
    {
      title: 'Local Craft Workshop',
      description: `Learn traditional crafts from local artisans in ${destination}.`,
      category: 'Culture',
      duration: '2 hours'
    },
    {
      title: 'Scenic Photography Tour',
      description: `Capture the most photogenic spots in ${destination}.`,
      category: 'Sightseeing',
      duration: '3 hours'
    }
  ];
};

// Get activities for a destination, falling back to generic ones if not found
export const getActivitiesForDestination = (destination: string): Activity[] => {
  const normalizedDestination = Object.keys(popularActivities).find(
    key => key.toLowerCase() === destination.toLowerCase()
  );
  
  if (normalizedDestination) {
    return popularActivities[normalizedDestination];
  }
  
  return generateGenericActivities(destination);
}; 