import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinationsService } from './../destinations.service';
import { Destination } from './../models/destination.model';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  trendingDestinations: Destination[] = [];

  constructor(
    private destinationsService: DestinationsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTrendingDestinations();
    this.initScrollAnimations();
  }

  loadTrendingDestinations() {
    this.destinationsService.getDestinations().subscribe(destinations => {
      this.trendingDestinations = destinations.slice(0, 6);
    });
  }

  searchDestinations() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/destinations'], { queryParams: { search: this.searchQuery } });
    } else {
      this.router.navigate(['/destinations']);
    }
  }

  toggleFavorite(destinationId: string) {
    this.destinationsService.toggleFavorite(destinationId);
    this.loadTrendingDestinations();
  }

  planTrip(destination: Destination) {
    this.router.navigate(['/trip-planner'], { queryParams: { destination: destination.id } });
  }

  private initScrollAnimations() {
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
