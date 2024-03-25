import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ItusersComponent } from './itusers.component';
import { DataTablesModule } from 'angular-datatables';

export const routes: Routes = [
  { path: '', component: ItusersComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxCaptchaModule,
    DataTablesModule
  ],
  declarations: [ItusersComponent],

})

export class ITUsersModule { }