import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), title: 'Home'
  },
  {
    path: 'destinations',
    loadComponent: () => import('./destinations/destinations.component').then(m => m.DestinationsComponent), title: 'Destinations'
  },
  {
    path: 'trip-planner',
    loadComponent: () => import('./trip-planner/trip-planner.component').then(m => m.TripPlannerComponent) , title: 'Trip Planner'
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent), title: 'About Us'
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) , title: 'Contact Us'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }