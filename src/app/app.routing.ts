import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';

export const routes: Routes = [
 
  { path: '', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'view', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: '**', component: NotFoundComponent }
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
      relativeLinkResolution: 'legacy',
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }