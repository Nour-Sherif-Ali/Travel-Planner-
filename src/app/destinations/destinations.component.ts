import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinationsService } from './../destinations.service';
import { Destination, FilterOptions } from './../models/destination.model';
@Component({
  selector: 'app-destinations',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.scss'
})
export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  searchTerm = '';
  viewMode: 'grid' | 'list' = 'grid';
  
  filters: FilterOptions = {
    region: '',
    minPrice: 0,
    maxPrice: 5000,
    activities: []
  };

  availableActivities = [
    'Beach', 'Museums', 'Temple Tours', 'Fine Dining', 'Architecture', 
    'Surfing', 'Technology Tours', 'Wine Tasting', 'Photography', 
    'Boat Tours', 'Broadway Shows', 'Shopping', 'Safari', 'Hiking', 'Cultural Tours'
  ];

  constructor(
    private destinationsService: DestinationsService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit() {
    this.loadDestinations();
    this.handleRouteParams();
    this.initScrollAnimations();
  }

  handleRouteParams() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
        this.onFilterChange();
      }
    });
  }

  loadDestinations() {
    this.destinationsService.getDestinations().subscribe(destinations => {
      this.destinations = destinations;
      this.applyFilters();
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  toggleActivity(activity: string) {
    const index = this.filters.activities.indexOf(activity);
    if (index > -1) {
      this.filters.activities.splice(index, 1);
    } else {
      this.filters.activities.push(activity);
    }
    this.onFilterChange();
  }

  applyFilters() {
    let filtered = [...this.destinations];

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchLower) ||
        dest.country.toLowerCase().includes(searchLower) ||
        dest.description.toLowerCase().includes(searchLower) ||
        dest.activities.some(activity => activity.toLowerCase().includes(searchLower))
      );
    }

    // Region filter
    if (this.filters.region) {
      filtered = filtered.filter(dest => dest.region === this.filters.region);
    }

    // Price filter
    filtered = filtered.filter(dest => 
      dest.price >= this.filters.minPrice && dest.price <= this.filters.maxPrice
    );

    // Activity filter
    if (this.filters.activities.length > 0) {
      filtered = filtered.filter(dest => 
        this.filters.activities.some(activity => dest.activities.includes(activity))
      );
    }

    this.filteredDestinations = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.filters = {
      region: '',
      minPrice: 0,
      maxPrice: 5000,
      activities: []
    };
    this.applyFilters();
  }

  toggleFavorite(destinationId: string) {
    this.destinationsService.toggleFavorite(destinationId);
    this.loadDestinations();
  }

  planTrip(destination: Destination) {
    this.router.navigate(['/trip-planner'], { queryParams: { destination: destination.id } });
  }

  private initScrollAnimations() {
    // Only run this in browser environment (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach(el => observer.observe(el));
    }, 100);
  }
}
