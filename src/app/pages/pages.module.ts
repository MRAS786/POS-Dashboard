import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { routing } from './pages.routing';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

@NgModule({
  
    imports: [
      CommonModule, 
      FormsModule, 
      ReactiveFormsModule,
      routing,
    ],
  
    declarations: [
    
  ],
    providers: [],
  })
  export class PagesModule { }