import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Destination, TripPlan, FilterOptions } from './models/destination.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {
  private mockDestinations: Destination[] = [
    {
      id: '1',
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      description: 'Experience the magic of Bali with its stunning beaches, ancient temples, and vibrant culture.',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1200,
      rating: 4.8,
      activities: ['Beach', 'Temple Tours', 'Surfing', 'Yoga', 'Cultural Tours'],
      bestTime: 'April - October',
      duration: '7-10 days',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Mount Batur Sunrise', 'Seminyak Beach']
    },
    {
      id: '2',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      description: 'The City of Light offers romance, art, and culinary excellence at every corner.',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1800,
      rating: 4.9,
      activities: ['Museums', 'Fine Dining', 'Architecture', 'Shopping', 'River Cruise'],
      bestTime: 'April - June, September - November',
      duration: '5-7 days',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre']
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      description: 'A perfect blend of traditional culture and cutting-edge modernity.',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 2200,
      rating: 4.7,
      activities: ['Technology Tours', 'Traditional Gardens', 'Food Tours', 'Nightlife', 'Shopping'],
      bestTime: 'March - May, September - November',
      duration: '6-8 days',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Tsukiji Fish Market']
    },
    {
      id: '4',
      name: 'Santorini',
      country: 'Greece',
      region: 'Europe',
      description: 'Famous for its white-washed buildings, blue domes, and breathtaking sunsets.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Panoramic_view_of_Oia%2C_Santorini_island_%28Thira%29%2C_Greece.jpg/1280px-Panoramic_view_of_Oia%2C_Santorini_island_%28Thira%29%2C_Greece.jpg',
      price: 1500,
      rating: 4.9,
      activities: ['Beach', 'Wine Tasting', 'Photography', 'Boat Tours', 'Historical Sites'],
      bestTime: 'April - November',
      duration: '4-6 days',
      highlights: ['Oia Sunset', 'Red Beach', 'Akrotiri Ruins', 'Fira Town']
    },
    {
      id: '5',
      name: 'New York City',
      country: 'USA',
      region: 'North America',
      description: 'The city that never sleeps, filled with iconic landmarks and endless possibilities.',
      image: 'https://images.pexels.com/photos/290275/pexels-photo-290275.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 2000,
      rating: 4.6,
      activities: ['Museums', 'Broadway Shows', 'Shopping', 'Food Tours', 'Architecture'],
      bestTime: 'April - June, September - November',
      duration: '5-7 days',
      highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge']
    },
    {
      id: '6',
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Africa',
      description: 'A stunning coastal city with dramatic mountains, beautiful beaches, and rich history.',
      image: 'https://images.pexels.com/photos/2055389/pexels-photo-2055389.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1400,
      rating: 4.8,
      activities: ['Wine Tours', 'Safari', 'Hiking', 'Beach', 'Cultural Tours'],
      bestTime: 'November - March',
      duration: '7-10 days',
      highlights: ['Table Mountain', 'V&A Waterfront', 'Robben Island', 'Cape of Good Hope']
    },
    {
     id: '7',
      name: 'Machu Picchu',
      country: 'Peru',
      region: 'South America',
      description: 'An ancient Incan city set high in the Andes Mountains, offering breathtaking views and a mystical atmosphere.',
      image: 'https://images.pexels.com/photos/3574440/pexels-photo-3574440.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 1700,
      rating: 4.9,
      activities: ['Hiking', 'Historical Sites', 'Photography', 'Cultural Tours', 'Archaeology'],
      bestTime: 'May - September',
      duration: '4-6 days',
      highlights: ['Inca Trail', 'Sun Gate', 'Huayna Picchu', 'Sacred Valley']
    },
    
    
  ];

  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.loadFavorites();
  }

  getDestinations(): Observable<Destination[]> {
    return of(this.mockDestinations.map(dest => ({
      ...dest,
      isFavorite: this.favoritesSubject.value.includes(dest.id)
    })));
  }

  getDestinationById(id: string): Observable<Destination | undefined> {
    const destination = this.mockDestinations.find(dest => dest.id === id);
    if (destination) {
      destination.isFavorite = this.favoritesSubject.value.includes(destination.id);
    }
    return of(destination);
  }

  getFilteredDestinations(filters: Partial<FilterOptions>): Observable<Destination[]> {
    let filtered = [...this.mockDestinations];
    
    if (filters.region && filters.region !== 'All') {
      filtered = filtered.filter(dest => dest.region === filters.region);
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(dest => dest.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(dest => dest.price <= filters.maxPrice!);
    }
    
    if (filters.activities && filters.activities.length > 0) {
      filtered = filtered.filter(dest => 
        filters.activities!.some(activity => dest.activities.includes(activity))
      );
    }

    return of(filtered.map(dest => ({
      ...dest,
      isFavorite: this.favoritesSubject.value.includes(dest.id)
    })));
  }

  toggleFavorite(destinationId: string): void {
    const currentFavorites = this.favoritesSubject.value;
    let newFavorites: string[];
    
    if (currentFavorites.includes(destinationId)) {
      newFavorites = currentFavorites.filter(id => id !== destinationId);
    } else {
      newFavorites = [...currentFavorites, destinationId];
    }
    
    this.favoritesSubject.next(newFavorites);
    this.saveFavorites(newFavorites);
  }

  getFavoriteDestinations(): Observable<Destination[]> {
    const favoriteIds = this.favoritesSubject.value;
    const favorites = this.mockDestinations.filter(dest => favoriteIds.includes(dest.id));
    return of(favorites.map(dest => ({ ...dest, isFavorite: true })));
  }

  private loadFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('travel-favorites');
      if (stored) {
        this.favoritesSubject.next(JSON.parse(stored));
      }
    }
  }

  private saveFavorites(favorites: string[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('travel-favorites', JSON.stringify(favorites));
    }
  }
}