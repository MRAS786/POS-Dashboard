import { DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AppGlobal } from 'src/app/services/app.global';
import { GvarService } from 'src/app/services/gvar.service';

@Component({
  selector: 'app-itusers',
  templateUrl: './itusers.component.html',
  styleUrls: ['./itusers.component.scss']
})
export class ItusersComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  modalRef: NgbModalRef;
  locationForm: FormGroup;
  listUsers: any = [];
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private config: AppGlobal,
    private GV: GvarService,
    private API: ApiService,
    private datepipe: DatePipe,
    private modalService: NgbModal
  ) {
    this.listUsers = [];
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getLocations();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
  }

  InitializeForm() {
    this.locationForm = this.fb.group({
      locationID: [''],
      locationName: ['', Validators.compose([Validators.required])],
      shortName: ['', Validators.compose([Validators.required])],
      isActive: ['']
    });
  }
  openAddModal(content) {
    this.locationForm.reset();
    this.modalRef = this.modalService.open(content, { centered: false, backdrop: 'static', keyboard: false, size: 'sm' });
  }

  saveLocations() {
    if (this.locationForm.controls.locationID.value == null) {
      this.locationForm.controls.locationID.setValue(0);
    }
    this.API.PostData(this.config.SAVE_LOCATIONS, this.locationForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          this.listUsers = data;
          this.modalRef.close();
          this.getLocations();
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }

  getLocations() {
    this.API.getdata(this.config.GET_LOCATIONS_ALL).subscribe({
      next: (data) => {
        if (data != null) {
          this.destroyDT(0, false).then(destroyed => {
            this.listUsers = data;
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
  onEditLocation(content, data) {
    this.locationForm.patchValue(data);
    this.modalRef = this.modalService.open(content, { centered: false, backdrop: 'static', keyboard: false, size: 'sm' });
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
