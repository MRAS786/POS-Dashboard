import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChartsModule } from 'ng2-charts';
import {NgxPrintModule} from 'ngx-print';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ItemsReportComponent } from './items-report.component';
export const routes: Routes = [
  { path: '', component: ItemsReportComponent, pathMatch: 'full' }
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
    NgxExtendedPdfViewerModule
  ],
  declarations: [
    ItemsReportComponent
  ]
})

export class ItemsReportModule { }
