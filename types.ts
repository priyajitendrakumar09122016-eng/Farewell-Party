export type FoodChoice = 'veg' | 'non-veg';

export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  foodChoice: FoodChoice;
  submittedAt: string;
}

export interface SummaryStats {
  totalRSVPs: number;
  vegPortions: number;
  nonVegPortions: number;
}

export interface EventInfo {
  title: string;
  honorees: string;
  date: string;
  time: string;
  locationName: string;
  fullAddress: string;
}
