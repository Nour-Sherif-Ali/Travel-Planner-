import { Component } from '@angular/core';
import { RouterOutlet,provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TravelPlanner';
   constructor() {
    // Initialize scroll to top on route changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        window.scrollTo(0, 0);
      });
    }
  }
}



