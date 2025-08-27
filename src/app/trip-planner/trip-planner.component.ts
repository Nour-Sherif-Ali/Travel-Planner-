import { Component, OnInit,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinationsService } from './../destinations.service';
import { TripPlannerService } from './../trip-planner.service';
import { Destination, TripPlan } from './../models/destination.model';
@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-planner.component.html',
  styleUrl: './trip-planner.component.scss'
})
export class TripPlannerComponent implements OnInit {
  destinations: Destination[] = [];
  suggestions: Destination[] = [];
  plannedTrips: TripPlan[] = [];
  selectedDestinationId = '';
  selectedDestination: Destination | null = null;
   isActivityDropdownOpen: boolean = false;
activities: string[] = []; // list currently shown in dropdown
defaultActivities: string[] = [
  'Beach', 'Wine Tasting', 'Photography', 'Boat Tours', 'Historical Sites'
];

  tripData = {
    startDate: '',
    endDate: '',
    activities: [] as string[],
    notes: ''
  };

  constructor(
    private destinationsService: DestinationsService,
    private tripPlannerService: TripPlannerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadDestinations();
    this.loadPlannedTrips();
    this.handleRouteParams();
  }

  handleRouteParams() {
    this.route.queryParams.subscribe(params => {
      if (params['destination']) {
        this.selectedDestinationId = params['destination'];
        this.onDestinationChange();
      }
    });
  }





  // Optional: A method to manually toggle the dropdown
  toggleActivityDropdown(): void {
    this.isActivityDropdownOpen = !this.isActivityDropdownOpen;
  }

  // This listener will close the dropdown if a click happens outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click was outside the dropdown element
    // You need to add a template reference variable #dropdownTrigger to your button in the HTML
    const targetElement = event.target as HTMLElement;
    if (targetElement && !targetElement.closest('#dropdownTrigger')) {
      this.isActivityDropdownOpen = false;
    }
  }

  loadDestinations() {
    this.destinationsService.getDestinations().subscribe(destinations => {
      this.destinations = destinations;
      this.suggestions = destinations.slice(0, 4);
      if (this.selectedDestinationId) {
        this.onDestinationChange();
      }
    });
  }

  loadPlannedTrips() {
    this.tripPlannerService.getTrips().subscribe(trips => {
      this.plannedTrips = trips;
    });
  }

 onDestinationChange() {
  this.selectedDestination = this.destinations.find(d => d.id === this.selectedDestinationId) || null;
  this.tripData.activities = [];

  // set activities list for dropdown: prefer destination-specific activities if available
  if (this.selectedDestination && Array.isArray(this.selectedDestination.activities) && this.selectedDestination.activities.length) {
    this.activities = this.selectedDestination.activities;
  } else {
    this.activities = [...this.defaultActivities];
  }
}

  toggleTripActivity(activity: string) {
    const index = this.tripData.activities.indexOf(activity);
    if (index > -1) {
      this.tripData.activities.splice(index, 1);
    } else {
      this.tripData.activities.push(activity);
    }
     
  }

  addTripPlan() {

      if (!this.selectedDestination || !this.tripData.startDate || !this.tripData.endDate) return; 
      
    const newTrip: TripPlan = {
      id: Date.now().toString(),
      destination: this.selectedDestination,
      startDate: new Date(this.tripData.startDate),
      endDate: new Date(this.tripData.endDate),
      activities: [...this.tripData.activities],
      notes: this.tripData.notes
    };

    this.tripPlannerService.addTrip(newTrip).subscribe(() => {
      this.loadPlannedTrips();
      this.resetForm();
    });
  }

  removeTripPlan(tripId: string) {
    this.tripPlannerService.removeTrip(tripId).subscribe(() => {
      this.loadPlannedTrips();
    });
  }

  selectSuggestion(destination: Destination) {
    this.selectedDestinationId = destination.id;
    this.onDestinationChange();
    
    // Scroll to form
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getTotalCost(): number {
    return this.plannedTrips.reduce((total, trip) => total + trip.destination.price, 0);
  }

  private resetForm() {
    this.selectedDestinationId = '';
    this.selectedDestination = null;
    this.tripData = {
      startDate: '',
      endDate: '',
      activities: [],
      notes: ''
    };
  }
}

