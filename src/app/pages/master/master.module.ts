import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {NgxMaskModule, IConfig} from 'ngx-mask';
import { UsersComponent } from './users/users.component';
import { CategoryComponent } from './category/category.component';
import { GroupsComponent } from './groupsRoles/groups.component';


export const routes: Routes = [
     { path: 'users', component: UsersComponent, pathMatch: 'full', data: { breadcrumb: 'Users', title: 'Users' } },
     { path: 'category', component: CategoryComponent, pathMatch: 'full', data: { breadcrumb: 'Category', title: 'Category' } },
     { path: 'grouproles', component: GroupsComponent, pathMatch: 'full', data: { breadcrumb: 'Group Roles', title: 'GR' } },

]
export const options: Partial<IConfig> = {
    thousandSeparator: "'"
  };
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        DataTablesModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgxMaskModule.forRoot(options),
    ],
    declarations: [
    UsersComponent,
    CategoryComponent,
    GroupsComponent
  ],
    providers:[
        DatePipe 
    ]
})

export class MasterModule { }