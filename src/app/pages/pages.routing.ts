import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages.component';
import { Auth } from '../services/guard.service';


export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [Auth],
        children: [
            { path: 'index', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' } },
            { path: 'dailysales', loadChildren: () => import('./dailySales/daily-sales.module').then(m => m.DailySalesModule), data: { breadcrumb: 'Daily Sales' } },
            { path: 'foodsales', loadChildren: () => import('./foodWiseSales/food-sales.module').then(m => m.FoodSalesModule), data: { breadcrumb: 'Category Wise Report' } },
            { path: 'timeslotsales', loadChildren: () => import('./timeSlotSales/time-slot-sales.module').then(m => m.TimeSlotSalesModule), data: { breadcrumb: 'Hourly Report' } },
            { path: 'timeslotnopsales', loadChildren: () => import('./timeSlotNop/time-slot-nop-sales.module').then(m => m.TimeSlotNOPSalesModule), data: { breadcrumb: 'Hourly Report NOP' } },
            { path: 'itemsreport', loadChildren: () => import('./itemsReport/items-report.module').then(m => m.ItemsReportModule), data: { breadcrumb: 'Items Report' } },
            { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule), data: { breadcrumb: 'Master'} },
        ]
    }
]

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);