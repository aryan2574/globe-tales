export const LEVEL_CONFIG = {
  Beginner: { nextLevel: 'Traveler', threshold: 100 },
  Traveler: { nextLevel: 'Explorer', threshold: 250 },
  Explorer: { nextLevel: 'Adventurer', threshold: 500 },
  Adventurer: { nextLevel: 'Globetrotter', threshold: 1000 },
  Globetrotter: { nextLevel: null, threshold: Infinity },
};

export type Level = keyof typeof LEVEL_CONFIG;
