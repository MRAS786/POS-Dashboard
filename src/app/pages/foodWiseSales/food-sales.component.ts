import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
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
import { MultiDataSet, Label, SingleDataSet } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BarInterface, grandSaleRequestModel } from './food-sales.model';
import * as Chart from 'chart.js';
import { Color, ViewDimensions } from '@swimlane/ngx-charts';
import * as moment from 'moment';
@Component({
  selector: 'food-sales',
  templateUrl: './food-sales.component.html',
  styleUrls: ['./food-sales.component.scss']
})
export class FoodSalesComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dataTable: any;

  totalDays: any;
  FromDate: any;
  ToDate: any;
  hideShow: boolean = false;
  locName: any;
  listYearDetails: any = [];
  listMonthlyDetails: any = [];
  listDailyDetails: any = [];
  listDailyCost: any = [];
  listSaleCost: any = [];
  view: any[] = [1050, 400];
  view2: any[] = [500, 200];
  view3: any[] = [750, 200];
  view4: any[] = [1000, 200];;
  view5: any[] = [1100, 400];
  view6: any[] = [300, 200];
  view7: any[] = [500, 200];
  view8: any[] = [300, 200];
  view9: any[] = [480, 200];

  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = false;
  public showYAxisLabel = false;
  public tooltipDisabled = false;
  public showDataLabel = true;
  public wrapTicks = true;
  public noBarWhenZero = true;
  public showGridLines = true;
  public showLabels = true;
  public explodeSlices = true;
  public doughnut = false;
  legend: boolean = true;

  dims: ViewDimensions;
  legendPosition: string = 'below';
  cardColor: string = '#fff';
  public schemeType = "ordinal"; //linear
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060', '#033E3E', '#00A36C', '#32CD32', '#CD853F', '#FF5F1F', '#7D0541', '#6AFB92', '#008B8B'],
  };
  public colorScheme2 = {
    domain: ['#008000', '#571B7E', '#B8860B', '#606060'],
  };
  public colorScheme3 = {
    domain: ['#B8860B', '#571B7E', '#F47B00', '#606060'],
  };

  public colorScheme4 = {
    domain: ['#00A36C', '#0096A6', '#CD853F', '#FF5F1F', '#7D0541', '#6AFB92', '#033E3E'],
  };




  netAmount: number;
  Quantity: number;
  TaxAmt: number;
  disAmount: number;
  TotalAmt: number;
  Amount: number;
  taxAmt: number;
  invoiceNumber: string;
  modalRef: NgbModalRef;
  modalRef2: NgbModalRef;

  searchForm: FormGroup;
  hideShowDiv: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  grandSaleRequestModel: grandSaleRequestModel;
  getLocationsList: any = [];
  selectedLocations: any = [];

  getCategoryList: any = [];
  selectedCategories: any = [];

  invoiceDetailResponse: any = [];
  reportListDateWise: any = [];
  foodwiseResponseModel: any = [];
  itemDetailResponse: any = [];
  salesListDateWise: any = [];
  complaintCount = [];
  grandTotal: number = 0;

  totalSales = 0;
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
        anchor: 'center',
        align: 'center',
        color: 'black',
        padding: 0,
        formatter: function (value) {
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




  costCount = [];
  public costWiseLabels: Label[];
  public barChartCost: ChartDataSets[] = [
    { data: [12, 68, 6], label: 'Series A' }
  ];


  shareInSalesCount = [];
  public shareinSalesLabels: Label[];
  public barChartshareInSales: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];

  salesAndCost = [];
  salesAndCost2 = [];
  public salesAndCostLabels: Label[];
  public barChartshareAndCost: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];

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
      idField: 'mcode',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.grandSaleRequestModel = new grandSaleRequestModel();
    this.getLocationsList = [];
    this.selectedLocations = [];
    this.foodwiseResponseModel = [];
    this.complaintCount = [];
    this.reportListDateWise = [];
    this.invoiceDetailResponse = [];
    this.getCategoryList = [];
    this.selectedLocations = [];
    this.itemDetailResponse = [];
    this.salesListDateWise = [];
    this.costCount = [];
    this.shareInSalesCount = [];
    this.salesAndCost = [];
    this.salesAndCost2 = [];

    this.listDailyDetails = [];
    this.listMonthlyDetails = [];
    this.listYearDetails = [];
    this.listDailyCost = [];
    this.listSaleCost = [];
  }

  ngOnInit() {
    this.InitializeForm();
    this.getAssignedLocations();
    this.getCategory();

    this.searchForm.get('mFromDate').patchValue(this.formatDate(new Date()));
    this.searchForm.get('mToDate').patchValue(this.formatDate(new Date()));

    this.setDefaultDateRange("today");
    this.onClickLocation(0, "All");

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
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
  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
    this.dtTrigger1.next(0);
    this.dtTrigger2.next(0);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
  InitializeForm() {
    this.searchForm = this.fb.group({
      locationID: ['', Validators.compose([Validators.required])],
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

  searchSales() {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = this.selectedCategories;
    this.grandSaleRequestModel.mcode = '';
    this.API.PostData(this.config.GET_FOOD_WISE_REPORT, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.hideShowDiv = true;

          this.destroyDT(0, true).then((destroyed) => {
            this.foodwiseResponseModel = data;
            this.dtTrigger.next(0);
          });

          this.totalSales = 0;
          for (let d of data) {
            if (d != null) {
              this.totalSales = this.totalSales + d.SAmt;
            }
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

  getAssignedLocations() {
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

  resetForm() {
    this.searchForm.reset();
    this.hideShowDiv = false;
  }

  onItemSelectCat(item: any) {
    this.grandSaleRequestModel.categoryList.push(item);
  }
  onSelectAllCat(items: any) {
    this.grandSaleRequestModel.categoryList = items;
  }
  ondeSelectCat(items: any) {
    this.grandSaleRequestModel.categoryList.splice(this.grandSaleRequestModel.categoryList.findIndex(ele => ele.mcode == items.mcode), 1);
  }

  getCategory() {
    this.API.getdata(this.config.GET_CATEGORY_LIST).subscribe({
      next: (data) => {
        if (data != null) {
          this.getCategoryList = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getItemDetail(mcode) {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = [];
    this.grandSaleRequestModel.mcode = mcode;
    this.API.PostData(this.config.ITEM_WISE_REPORT, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {

          this.destroyDT(1, true).then((destroyed) => {
            this.itemDetailResponse = data;
            this.dtTrigger1.next(0);
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

  getSalesDetail(itemcode1) {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = [];
    this.grandSaleRequestModel.mcode = '';
    this.grandSaleRequestModel.itemcode1 = itemcode1;
    this.API.PostData(this.config.GET_DATE_WISE_DETAILS, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {

          this.destroyDT(2, true).then((destroyed) => {
            this.salesListDateWise = data;
            this.dtTrigger2.next(0);
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


  getInvoiceDetail(invoiceno) {
    this.API.getdata(this.config.GET_RECIPT_DETAILS_INVOICE + invoiceno).subscribe({
      next: (data) => {
        if (data != null) {
          // this.modalRef2 = this.modalService.open(content, { centered: false, size: 'lg' });
          this.invoiceNumber = invoiceno;
          this.invoiceDetailResponse = data;
          this.Quantity = this.invoiceDetailResponse.reduce((sum, current) => sum + current.qty, 0);
          var sellprice = this.invoiceDetailResponse.reduce((sum, current) => sum + current.sellprice, 0);
          var StAmt = this.invoiceDetailResponse.reduce((sum, current) => sum + current.StAmt, 0);
          this.disAmount = this.invoiceDetailResponse[0].DisAmount;
          this.taxAmt = StAmt;
          this.Amount = this.invoiceDetailResponse.reduce((sum, current) => sum + current.qty * current.sellprice, 0);
          this.TotalAmt = this.invoiceDetailResponse.reduce((sum, current) => sum + current.qty * current.sellprice + current.StAmt, 0);
          this.netAmount = this.TotalAmt - this.disAmount;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }



  getDailySales() {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = this.selectedCategories;
    this.grandSaleRequestModel.mcode = '';

    this.API.PostData(this.config.GET_CATEGORY_WISE_DATA, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.listDailyDetails = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });

  }
  getMonthlySales() {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = this.selectedCategories;
    this.grandSaleRequestModel.mcode = '';

    this.API.PostData(this.config.GET_MONTHLY_CATEGORY_WISE_DETAILS, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.listMonthlyDetails = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });

  }
  getYearlySales() {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = this.selectedCategories;
    this.grandSaleRequestModel.mcode = '';

    this.API.PostData(this.config.GET_YEARLY_CATEGORY_WISE_DETAILS, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.listYearDetails = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });

  }
  getDailyCostData() {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = this.selectedCategories;
    this.grandSaleRequestModel.mcode = '';

    this.API.PostData(this.config.GET_DAILY_COST_DETAILS, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.listDailyCost = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });

  }
  getSalesCostData() {
    this.grandSaleRequestModel.mFromDate = this.searchForm.controls.mFromDate.value;
    this.grandSaleRequestModel.mToDate = this.searchForm.controls.mToDate.value;
    this.grandSaleRequestModel.locationList = this.searchForm.controls.locationID.value;
    this.grandSaleRequestModel.categoryList = this.selectedCategories;
    this.grandSaleRequestModel.mcode = '';

    this.API.PostData(this.config.GET_SALES_COST_DETAILS, this.grandSaleRequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          this.listSaleCost = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });

  }
  public onSelect(event) {
    console.log(event);
  }

  onClickLocation(locationID, locName) {
    this.locName = locName;
    this.searchForm.controls.locationID.setValue(locationID);
    this.getDailySales();
  }
  loadAllCharts() {
    this.getYearlySales();
    this.getDailySales();
    this.getMonthlySales();
    this.getDailyCostData();
    this.getSalesCostData();
  }
  setDefaultDateRange(option: string) {
    const today = new Date();
    let startDate: string;
    let endDate: string;
    if (option == "custom") {
      this.hideShow = true;
    }
    else {
      this.hideShow = false;
    }
    switch (option) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'last7Days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        startDate = sevenDaysAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'last30Days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'lastMonth':
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate = firstDayLastMonth.toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      default:
        // Default to an empty range
        startDate = '';
        endDate = '';
        break;
    }

    this.searchForm.patchValue({
      mFromDate: startDate,
      mToDate: endDate
    });
    this.FromDate = this.searchForm.controls.mFromDate.value;
    this.ToDate = this.searchForm.controls.mToDate.value;
    const timeDifference = new Date(this.searchForm.controls.mToDate.value).getTime() - new Date(this.searchForm.controls.mFromDate.value).getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    this.totalDays = daysDifference + 1;
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
