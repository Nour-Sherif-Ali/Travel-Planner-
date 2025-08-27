import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TripPlan } from './models/destination.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TripPlannerService {
  private tripsSubject = new BehaviorSubject<TripPlan[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.loadTrips();
  }

  addTrip(trip: TripPlan): Observable<boolean> {   //i've changed here
  try {
    const currentTrips = this.tripsSubject.value;
    const newTrips = [...currentTrips, trip];
    this.tripsSubject.next(newTrips);
    this.saveTrips(newTrips);
    return of(true);
  } catch (error) {
    console.error('Error adding trip:', error);
    return of(false);
  }
}

  removeTrip(tripId: string): Observable<boolean> {
    const currentTrips = this.tripsSubject.value;
    const newTrips = currentTrips.filter(trip => trip.id !== tripId);
    this.tripsSubject.next(newTrips);
    this.saveTrips(newTrips);
    return of(true);
  }

  getTrips(): Observable<TripPlan[]> {
    return this.trips$;
  }

  private loadTrips(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('travel-trips');
      if (stored) {
        const trips = JSON.parse(stored).map((trip: any) => ({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate)
        }));
        this.tripsSubject.next(trips);
      }
    }
  }

private saveTrips(trips: TripPlan[]): void {
  if (isPlatformBrowser(this.platformId)) {
    // Convert Date objects to ISO strings for storage
    const tripsForStorage = trips.map(trip => ({
      ...trip,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString()
    }));
    localStorage.setItem('travel-trips', JSON.stringify(tripsForStorage));
  }
}
}