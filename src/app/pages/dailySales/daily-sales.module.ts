import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DailySalesComponent } from './daily-sales.component';
import { ChartsModule } from 'ng2-charts';
export const routes: Routes = [
  { path: '', component: DailySalesComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),   
    ChartsModule 
  ],
  declarations: [
    DailySalesComponent
  ]
})

export class DailySalesModule { }
