import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicMenuComponent } from './dynamic-menu.component';
import { DataTablesModule } from 'angular-datatables';

export const routes: Routes = [
  { path: '', component: DynamicMenuComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule
  ],
  declarations: [
    DynamicMenuComponent
  ]
})
export class DynamicMenuModule { }
