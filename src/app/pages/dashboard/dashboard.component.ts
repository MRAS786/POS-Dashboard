import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pbi from 'powerbi-client';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobal } from 'src/app/services/app.global';
import { GvarService } from 'src/app/services/gvar.service';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { grandSaleRequestModel } from './dashboard.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  modalRef: NgbModalRef;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();
  url: any;
  accessToken: any;
  UserId: any;
  searchForm: FormGroup;
  grandSaleRequestModel: grandSaleRequestModel;
  getLocationsList: any = [];
  selectedLocations:any = [];
  monthlyReportList: any = [];
  netAmount:number;
  Quantity:number;
  TaxAmt:number;
  disAmount:number;
  TotalAmt:number;
  Amount:number;
  taxAmt:number;
  invoiceNumber:string;
  invoiceDetailResponse: any = [];
  locId: any;
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
    this.monthlyReportList = [];
    this.invoiceDetailResponse = [];
  }

  ngOnInit() {
    this.getAssignedLocations();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
    this.dtTrigger1.next(0);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger1.unsubscribe();
  }
  getAssignedLocations(){
    this.API.getdata(this.config.GET_DASHBOARD_DATA + this.UserId).subscribe({
      next: (data) => {
        if (data != null) {
            this.getLocationsList = data;
            this.rerender();
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getMonthlySales(locationID){
    this.locId = locationID;
    this.API.getdata(this.config.MONTHALY_SALES_BY_LOCATION + locationID).subscribe({
      next: (data) => {
        if (data != null) {
          this.monthlyReportList =  data;
          this.rerender();
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getDailySales(locationID){
    this.locId = locationID;
    this.API.getdata(this.config.DAILY_SALES_BY_LOCATION + locationID).subscribe({
      next: (data) => {
        if (data != null) {
          this.monthlyReportList =  data;
          this.rerender();
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getInvoiceDetail(data){
    this.invoiceNumber = data.invoiceno;
    let body = {
      invoiceno: data.invoiceno,
      locationID: this.locId 
    }
    this.API.PostData(this.config.GET_RECIPT_DETAILS_INVOICE , body).subscribe({
      next: (data) => {
        if (data != null) {
          
          this.invoiceDetailResponse = data;
          this.Quantity = this.invoiceDetailResponse.reduce((sum, current) => sum + current.qty, 0);
          var sellprice = this.invoiceDetailResponse.reduce((sum, current) => sum + current.sellprice, 0);
          var StAmt = this.invoiceDetailResponse.reduce((sum, current) => sum + current.StAmt, 0);
          this.disAmount=this.invoiceDetailResponse[0].DisAmount;
          this.taxAmt=StAmt;
          this.Amount = this.invoiceDetailResponse.reduce((sum, current) => sum + current.qty * current.sellprice, 0);
          this.TotalAmt = this.invoiceDetailResponse.reduce((sum, current) => sum + current.qty * current.sellprice + current.StAmt, 0);
          this.netAmount=this.TotalAmt-this.disAmount;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }


  
  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
    });
    setTimeout(() => {
      this.dtTrigger.next(0);
      this.dtTrigger1.next(0);
    });
  }
}
