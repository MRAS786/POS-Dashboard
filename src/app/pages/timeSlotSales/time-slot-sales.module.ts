import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChartsModule } from 'ng2-charts';
import { NgxPrintModule } from 'ngx-print';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { TimeslotSalesComponent } from './time-slot-sales.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
export const routes: Routes = [
  { path: '', component: TimeslotSalesComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    ChartsModule,
    NgxPrintModule,
    NgxExtendedPdfViewerModule,
    NgxChartsModule
  ],
  declarations: [
    TimeslotSalesComponent
  ]
})

export class TimeSlotSalesModule { }
