import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pbi from 'powerbi-client';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobal } from 'src/app/services/app.global';
import { GvarService } from 'src/app/services/gvar.service';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { grandSaleRequestModel } from './dashboard.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  url: any;
  accessToken: any;
  UserId: any;
  searchForm: FormGroup;
  grandSaleRequestModel: grandSaleRequestModel;
  getLocationsList: any = [];
  selectedLocations:any = [];
  constructor(
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private config: AppGlobal,
    private GV: GvarService,
    private API: ApiService,
    private modalService: NgbModal) {
    this.accessToken = localStorage.getItem('access_token');
    this.UserId = localStorage.getItem('userID');
    this.grandSaleRequestModel = new grandSaleRequestModel();
    this.getLocationsList = [];
    this.selectedLocations = [];
  }

  ngOnInit() {
    this.getAssignedLocations();
  }

  getAssignedLocations(){
    this.API.getdata(this.config.GET_DASHBOARD_DATA + this.UserId).subscribe({
      next: (data) => {
        if (data != null) {
            this.getLocationsList = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
}
