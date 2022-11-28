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
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { MultiDataSet, Label, Color, SingleDataSet } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { grandSaleRequestModel } from './items.model';
@Component({
  selector: 'items-report',
  templateUrl: './items-report.component.html',
  styleUrls: ['./items-report.component.scss']
})
export class ItemsReportComponent implements OnInit {
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
  dtElements: QueryList<DataTableDirective>;
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
  dropdownSettings2: IDropdownSettings = {};
  grandSaleRequestModel: grandSaleRequestModel;
  getLocationsList: any = [];
  selectedLocations:any = [];
  getItemList: any = [];
  selectedItems:any = [];
  invoiceDetailResponse: any = [];
  reportListDateWise: any = [];
  complaintCount = [];
  listAllData = [];
  grandTotal: number = 0;
  public barChartType: ChartType = 'bar';
  public barChartTypeFeedBack: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartLabelsNaturewise: Label[];
  pieChartPlugins = [pluginDataLabels];
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
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
        padding: 2,
        formatter: function(value) {
          return Number(value).toFixed(0).replace(/./g, function (c, i, a) {
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
          callback: function (value, index, values) {
            return value.toLocaleString();   // this is all we need
          }
         
        }
      }]
    }
  };
  public barChartOptionsFoodWise: ChartOptions = {
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
      this.dropdownSettings2 = {
        singleSelection: false,
        idField: 'SubCCode',
        textField: 'Descr',
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
    this.invoiceDetailResponse = [];
    this.complaintCount = [];
    this.reportListDateWise = [];
    this.invoiceDetailResponse = [];
    this.listAllData = [];
    this.getItemList = [];
    this.selectedItems = [];
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  ngOnInit() {
    this.InitializeForm();
    this.getAssignedLocations();
    this.getItems();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
    this.searchForm.get('mFromDate').patchValue(this.formatDate(new Date()));
    this.searchForm.get('mToDate').patchValue(this.formatDate(new Date()));
  }
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
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
    this.invoiceDetailResponse = [];
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.selectedLocations;
    this.grandSaleRequestModel.ItemList = this.selectedItems;
    if(this.selectedLocations == ''){
      this.toastr.error("Select Location", 'Error');
    }
    else{
      this.API.PostData(this.config.ITEM_WISE_REPORT , this.grandSaleRequestModel).subscribe({
        next: (data) => {
          if (data != null) {
            this.hideShowDiv = true;
            this.invoiceDetailResponse = data;
            this.getBarChartHorizental();
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

  getBarChartHorizental() {
    this.grandTotal=0;
    this.invoiceDetailResponse.forEach(e => {
      this.grandTotal=this.grandTotal+e.Amount;
    });
    this.complaintCount = this.invoiceDetailResponse.map((item) => {
      return item.Amount;
    });
    // this.barChartDataNaturewise = [{ data: this.complaintCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd', '#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], fill: false }];
    this.barChartDataNaturewise = [{ data: this.complaintCount, backgroundColor: '#2196f3', hoverBackgroundColor: '#c75336', fill: false }];
    var complaintDept = [];
    complaintDept = this.invoiceDetailResponse.map((item) => {
        return item.SName;
    });
    this.barChartLabelsNaturewise = complaintDept;
  }

  onSelectItems(item: any) {
    this.grandSaleRequestModel.ItemList.push(item);
  }
  onSelectAllItems(items: any) {
    this.grandSaleRequestModel.ItemList = items;
  }
  ondeSelectItems(items: any) {
    this.grandSaleRequestModel.ItemList.splice(this.grandSaleRequestModel.ItemList.findIndex(ele => ele.SubCCode == items.SubCCode), 1);
  }
  getItems(){
    this.API.getdata(this.config.GET_ITEM_LIST).subscribe({
      next: (data) => {
        if (data != null) {
            this.getItemList = data;
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
    });

  }
}
