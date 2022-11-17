import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { routing } from './pages.routing';
import { CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  
    imports: [
      CommonModule, 
      FormsModule, 
      ReactiveFormsModule,
      routing,
    ],
  
    declarations: [
    
  ],
    providers: [DatePipe],
  })
  export class PagesModule { }