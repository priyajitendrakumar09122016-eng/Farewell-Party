export type FoodChoice = 'veg' | 'non-veg';

export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  attending: boolean;
  foodChoice?: FoodChoice;
  submittedAt: string;
}

export interface SummaryStats {
  totalRSVPs: number;
  attendingCount: number;
  vegPortions: number;
  nonVegPortions: number;
}

export interface EventInfo {
  title: string;
  honorees: string;
  date: string;
  time: string;
  locationName: string;
}
