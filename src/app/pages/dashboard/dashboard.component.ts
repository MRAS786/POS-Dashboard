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
  dropdownSettings: IDropdownSettings = {};
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
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'locationID',
        textField: 'locationName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      }
    this.accessToken = localStorage.getItem('access_token');
    this.UserId = localStorage.getItem('UserId');
    this.grandSaleRequestModel = new grandSaleRequestModel();
    this.getLocationsList = [];
    this.selectedLocations = [];
  }

  ngOnInit() {
    this.InitializeForm();
    this.getAssignedLocations();
  }
  InitializeForm() {
    this.searchForm = this.fb.group({
      mFromDate: [],
      mToDate: [''],
    });
  }
  onItemSelect(item: any) {
    this.grandSaleRequestModel.locationList.push(item);
  }
  onSelectAll(items: any) {
    this.grandSaleRequestModel.locationList = items;
  }
  ondeSelect(items: any) {
    this.grandSaleRequestModel.locationList.splice(this.grandSaleRequestModel.locationList.findIndex(ele => ele.locationID == items.locationID), 1);
  }
  getLocations(){
    this.API.getdata(this.config.GET_LOCATIONS).subscribe({
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

  searchSales(){
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.selectedLocations;
    this.API.PostData(this.config.GET_SALE_DATE_WISE , this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          if (data.isSaved == true) {
         
          }
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getAssignedLocations(){
    this.API.getdata(this.config.GET_ASSIGNED_LOCATIONS).subscribe({
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
