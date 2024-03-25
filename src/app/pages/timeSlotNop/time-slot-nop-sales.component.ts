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
import { grandSaleRequestModel } from '../dashboard/dashboard.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { MultiDataSet, Label, Color, SingleDataSet } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'time-slot-nop-sales',
  templateUrl: './time-slot-nop-sales.component.html',
  styleUrls: ['./time-slot-nop-sales.component.scss']
})
export class TimeslotNOPComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  totalDays: any;
  FromDate: any;
  ToDate: any;
  hideShow: boolean = false;
  locName: any;

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

  modalRef: NgbModalRef;

  searchForm: FormGroup;

  getLocationsList: any = [];
  hourlyResponseNOP: any = [];
  listAllData = [];
  constructor(
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private config: AppGlobal,
    private GV: GvarService,
    private API: ApiService,
    private datepipe: DatePipe,
    private modalService: NgbModal) {
    this.hourlyResponseNOP = [];
    this.listAllData = [];
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngOnInit() {
    this.InitializeForm();
    this.getAssignedLocations();

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
  InitializeForm() {
    this.searchForm = this.fb.group({
      mFromDate: ['', Validators.compose([Validators.required])],
      mToDate: ['', Validators.compose([Validators.required])],
      locationID: ['']
    });
  }

  searchSales() {
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
  detailData() {
    this.API.PostData(this.config.GET_DETAIL_REPORT, this.searchForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.destroyDT(0, true).then((destroyed) => {
            this.listAllData = data;
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




  onClickLocation(locationID, locName) {
    this.locName = locName;
    this.searchForm.controls.locationID.setValue(locationID);
    this.searchSales();
    this.detailData();
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
    this.searchSales();
    this.detailData();
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
