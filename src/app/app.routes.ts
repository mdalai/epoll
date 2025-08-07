import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.AdminComponent) },
  { path: 'poll/:id', loadComponent: () => import('./poll-vote/poll-vote').then(m => m.PollVoteComponent) },
];
