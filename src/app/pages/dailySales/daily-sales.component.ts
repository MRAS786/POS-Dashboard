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
import { grandSaleRequestModel } from '../dashboard/dashboard.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { MultiDataSet, Label, Color, SingleDataSet } from 'ng2-charts';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss']
})
export class DailySalesComponent implements OnInit {
  netAmount:number;
  Quantity:number;
  TaxAmt:number;
  disAmount:number;
  TotalAmt:number;
  Amount:number;
  taxAmt:number;
  invoiceNumber:string;
  modalRef: NgbModalRef;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  url: any;
  accessToken: any;
  UserId: any;
  searchForm: FormGroup;
  hideShowDiv: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  grandSaleRequestModel: grandSaleRequestModel;
  getLocationsList: any = [];
  selectedLocations:any = [];
  invoiceDetailResponse: any = [];
  reportListDateWise: any = [];
  reportList: any = [];
  complaintCount = [];

  public barChartType: ChartType = 'bar';
  public barChartTypeFeedBack: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartLabelsNaturewise: Label[];
  public barChartDataNaturewise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];
  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return "Rs " + Number(tooltipItem.yLabel).toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
          });
        }
      }
    },
    scales: {
      xAxes: [{
        ticks: {}
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 500000,
          callback: function (value, index, values) {
            var val = Number(value) / 1e6 + 'M';
            return val

          }
        }
      }]
    }
  };
  constructor(
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private config: AppGlobal,
    private GV: GvarService,
    private API: ApiService,
    private datepipe: DatePipe,
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
    this.reportList = [];
    this.complaintCount = [];
    this.reportListDateWise = [];
    this.invoiceDetailResponse = [];
  }

  ngOnInit() {
    this.InitializeForm();
    this.getAssignedLocations();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
  }
  InitializeForm() {
    this.searchForm = this.fb.group({
      mFromDate: ['', Validators.compose([Validators.required])],
      mToDate: ['', Validators.compose([Validators.required])],
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

  searchSales(){
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.selectedLocations;
    this.API.PostData(this.config.GET_SALE_DATE_WISE , this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.hideShowDiv = true;
          this.reportList = data;
          this.complaintCount =  this.reportList.map((item) => {
            return item.totalSale;
          });
          this.barChartDataNaturewise = [{ data: this.complaintCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd', '#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], fill: false }];
        
          var complaintDept = [];
          complaintDept =  this.reportList.map((item) => {
            let newDate = this.datepipe.transform(item.saleDate, 'dd/MM/yyyy')
            return item.saleDate;
          });
          this.barChartLabelsNaturewise = complaintDept;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });


    this.API.PostData(this.config.GET_DATE_WISE_DETAILS , this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.destroyDT(0, true).then((destroyed) => {
            this.hideShowDiv = true;
            this.reportListDateWise = data;
            this.dtTrigger.next(0);
          });
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

  resetForm(){
    this.searchForm.reset();
    this.hideShowDiv = false;
  }

  getInvoiceDetail(content, invoiceno){
    this.modalRef = this.modalService.open(content, { centered: false, size: 'lg' });
    this.API.getdata(this.config.GET_RECIPT_DETAILS_INVOICE + invoiceno).subscribe({
      next: (data) => {
        if (data != null) {
          this.invoiceNumber = invoiceno;
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

  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      this.datatableElement.forEach((dtElement: DataTableDirective, index) => {
        if (index == tableIndex) {
          if (dtElement.dtInstance) {
            if (tableIndex == 0) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });
            }
            else if (tableIndex == 1) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });
            } else if (tableIndex == 2) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });
            }
            else if (tableIndex == 3) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
            else if (tableIndex == 4) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });
            }
            else if (tableIndex == 5) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
          }
          else {
            resolve(true);
          }
        }
      });
    });
  };
}
