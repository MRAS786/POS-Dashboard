import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobal } from 'src/app/services/app.global';
import { GvarService } from 'src/app/services/gvar.service';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ViewDimensions } from '@swimlane/ngx-charts';
import 'daterangepicker';
@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss']
})
export class DailySalesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dtTrigger3: Subject<any> = new Subject();
  dtTrigger4: Subject<any> = new Subject();

  totalDays: any;
  FromDate: any;
  ToDate: any;
  hideShow: boolean = false;
  hideShowSpecific: boolean = false;
  listAllLocationDetails: any = [];
  listYearDetails: any = [];
  listMonthlyDetails: any = [];
  listDailyDetails: any = [];

  hourlyResponse: any = [];
  listAllData: any = [];

  hourlyResponseNOP: any = [];
  hourlylistAllData: any = [];
  listPayMode: any = [];


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





  tabStatus = 1;
  locID: any;
  netAmount: number;
  Quantity: number;
  TaxAmt: number;
  disAmount: number;
  TotalAmt: number;
  Amount: number;
  taxAmt: number;
  invoiceNumber: string;
  modalRef: NgbModalRef;


  searchForm: FormGroup;
  dropdownSettings: IDropdownSettings = {};
  getLocationsList: any = [];
  selectedLocations: any = [];
  invoiceDetailResponse: any = [];
  locationDetailList: any = [];
  reportListDateWise: any = [];
  reportList: any = [];
  complaintCount = [];
  dailyReports: any = [];
  monthlyReports: any = [];
  yearlyReports: any = [];
  monthlyReportList: any = [];

  locName: any;
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
    this.hourlyResponseNOP = [];
    this.hourlylistAllData = [];
    this.hourlyResponse = [];
    this.listAllData = [];
    this.getLocationsList = [];
    this.selectedLocations = [];
    this.reportList = [];
    this.complaintCount = [];
    this.reportListDateWise = [];
    this.invoiceDetailResponse = [];
    this.dailyReports = [];
    this.monthlyReports = [];
    this.yearlyReports = [];
    this.monthlyReportList = [];
    this.locationDetailList = [];
    this.listDailyDetails = [];
    this.listMonthlyDetails = [];
    this.listYearDetails = [];
    this.listAllLocationDetails = [];
    this.listPayMode = [];
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  }
  public onSelect(event) {
    // console.log(event);
  }

  ngOnInit() {
    this.InitializeForm();
    this.searchForm.controls.locationID.setValue(0);
    this.searchForm.controls.PaymentMode.setValue("All");

    this.searchForm.get('mFromDate').patchValue(this.formatDate(new Date()));
    this.searchForm.get('mToDate').patchValue(this.formatDate(new Date()));
    this.searchForm.get('Date').patchValue(this.formatDate(new Date()));

    this.getAssignedLocations();
    this.getPaymentMode(0);
    this.onClickLocation(0);
    this.setDefaultDateRange("today");
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
  }


  onClickTabs(status) {
    this.tabStatus = status;
    if (status == 1) {
      this.setDefaultDateRange("today");
      this.onClickLocation(0);
      this.locName = "All";
    }
    if (status == 2) {
      this.setDefaultDateRange("today");
      this.onClickLocation(0);
      this.locName = "All";
    }
    if (status == 3) {
      this.setDefaultDateRange("today");
      this.onClickLocation(0);
      this.locName = "All";
    }
  }

  InitializeForm() {
    this.searchForm = this.fb.group({
      mFromDate: ['', Validators.compose([Validators.required])],
      mToDate: ['', Validators.compose([Validators.required])],
      locationID: [''],
      PaymentMode: [''],
      Date: [''],
      Days: ['']
    });
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
  searchSales() {
    this.API.PostData(this.config.GET_DATE_WISE_DETAILS, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.reportListDateWise = data;
          // this.destroyDT(0, true).then((destroyed) => {

          //   this.dtTrigger.next(0);
          // });
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
  getInvoiceDetail(data) {
    this.invoiceNumber = data.invoiceno;
    let body = {
      invoiceno: data.invoiceno,
      locationID: this.locID
    }
    this.API.PostData(this.config.GET_RECIPT_DETAILS_INVOICE, body).subscribe({
      next: (data) => {
        if (data != null) {
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
  getSaleWiseData(data) {
    let body = {
      locationID: this.locID,
      mFromDate: data.dates,
      mToDate: this.searchForm.controls.mToDate.value
    }
    this.API.PostData(this.config.GET_SALES_LOCATION_WISE, body).subscribe({
      next: (data) => {
        if (data != null) {
          this.locationDetailList = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
  getSalesDetails(data) {
    this.locID = data.locationID;
    let body = {
      locationID: data.locationID,
      mFromDate: data.dates,
      mToDate: this.searchForm.controls.mToDate.value
    }
    this.API.PostData(this.config.GET_SALES_DETAILS, body).subscribe({
      next: (data) => {
        if (data != null) {
          this.monthlyReportList = data;
          // this.destroyDT(1, true).then((destroyed) => {

          //   this.dtTrigger2.next(0);
          // });

          // this.searchForm.reset();
          // this.setDefaultDateRange("today");

        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
  getChartDailyData() {
    this.API.PostData(this.config.GET_SALES_DAILY_DETAILS, this.searchForm.value).subscribe({
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
  getChartMonthlyData() {
    this.API.PostData(this.config.GET_SALES_MONTHLY_DETAILS, this.searchForm.value).subscribe({
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
  getChartYearData() {
    this.listYearDetails = [];
    this.API.PostData(this.config.GET_SALES_YEAR_DETAILS, this.searchForm.value).subscribe({
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
  getAllChartData() {
    this.API.PostData(this.config.GET_ALL_LOCATION_DETAILS, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.listAllLocationDetails = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
  onClickLocation(locationID) {
    if (Number(locationID) == 0) {
      this.locName = "All"
    }
    else {
      var index = this.getLocationsList.findIndex(c => c.locationID == Number(locationID));
      this.locName = this.getLocationsList[index].locationName;
    }
    this.locID = Number(locationID);
    this.searchForm.controls.locationID.setValue(this.locID);
    this.getPaymentMode(this.locID);
    if (this.tabStatus == 1) {
      this.searchSales();
      this.getChartDailyData();
      this.getChartMonthlyData();
      this.getChartYearData();
    }
    if (this.tabStatus == 2) {
      this.timeSales();
      this.timeDetailData();
    }
    if (this.tabStatus == 3) {
      this.hourlysearchSales();
      this.hourlydetailData();
    }
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
    if (option == "SpecificDays") {
      this.hideShowSpecific = true;
    }
    else {
      this.hideShowSpecific = false;
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
      case 'custom':
        startDate = this.searchForm.controls.mFromDate.value;
        endDate = this.searchForm.controls.mToDate.value;
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
    if (this.tabStatus == 1) {
      this.searchSales();
      this.getChartDailyData();
      this.getAllChartData();
    }
    if (this.tabStatus == 2) {
      this.timeSales();
      this.timeDetailData();
    }
    if (this.tabStatus == 3) {
      this.hourlysearchSales();
      this.hourlydetailData();
    }
    this.FromDate = this.searchForm.controls.mFromDate.value;
    this.ToDate = this.searchForm.controls.mToDate.value;
    const timeDifference = new Date(this.searchForm.controls.mToDate.value).getTime() - new Date(this.searchForm.controls.mFromDate.value).getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    this.totalDays = daysDifference + 1;
  }


  timeSales() {
    this.API.PostData(this.config.GET_HOURY_WISE_REPORT, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.hourlyResponse = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  timeDetailData() {
    this.API.PostData(this.config.GET_HOURLY_REPORT, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.listAllData = data;
          // this.destroyDT(2, false).then((destroyed) => {

          //   this.dtTrigger3.next(0);
          // });
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  hourlysearchSales() {
    this.API.PostData(this.config.GET_HOURY_NOP_WISE_REPORT, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.hourlyResponseNOP = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
  hourlydetailData() {
    this.API.PostData(this.config.GET_DETAIL_REPORT, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.hourlylistAllData = data;
          // this.destroyDT(3, false).then((destroyed) => {

          //   this.dtTrigger3.next(0);
          // });
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getPaymentMode(locationID) {
    this.API.getdata(this.config.GET_PAYMENT_MODE + locationID).subscribe({
      next: (data) => {
        if (data != null) {
          this.listPayMode = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
  onClickPayMode(event) {
    this.searchForm.controls.PaymentMode.setValue(event.target.value);
    if (this.tabStatus == 1) {
      this.searchSales();
      this.getChartDailyData();
      this.getChartMonthlyData();
      this.getChartYearData();
    }
    if (this.tabStatus == 2) {
      this.timeSales();
      this.timeDetailData();
    }
    if (this.tabStatus == 3) {
      this.hourlysearchSales();
      this.hourlydetailData();
    }
  }
  getSpecificDays() {
    let body = {
      Date: this.searchForm.controls.Date.value,
      Days: this.searchForm.controls.Days.value,
      PaymentMode: this.searchForm.controls.PaymentMode.value,
      LocationID: this.searchForm.controls.locationID.value
    }
    this.API.PostData(this.config.GET_SPECIFIC_DAYS, body).subscribe({
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
