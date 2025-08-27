export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  activities: string[];
  bestTime: string;
  duration: string;
  highlights: string[];
  isFavorite?: boolean;
}

export interface TripPlan {
  id: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
  activities: string[];
  notes: string;
}

export interface FilterOptions {
  region: string;
  minPrice: number;
  maxPrice: number;
  activities: string[];
}