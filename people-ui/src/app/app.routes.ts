import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'mugs', pathMatch: 'full' },
  {
    path: 'mugs',
    loadComponent: () => import('./mugs/mug-list.component').then(m => m.MugListComponent)
  }
];
