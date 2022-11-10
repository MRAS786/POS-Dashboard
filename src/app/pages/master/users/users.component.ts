import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AppGlobal } from 'src/app/services/app.global';
import { GvarService } from 'src/app/services/gvar.service';
import { assignLocations } from './users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  mobMask = "0000-0000000"
  modalRef: NgbModalRef;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  usersForm: FormGroup;
  onEditShowHide: boolean = false;
  getEmployeeList: any = [];
  getLocationsList: any = [];
  assignLocations: assignLocations;
  selectedLocations:any = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private config: AppGlobal,
    private GV: GvarService,
    private API: ApiService,
    private modalService: NgbModal
  ) { 
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'locationID',
      textField: 'locationName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.getEmployeeList = [];
    this.getLocationsList = [];
    this.assignLocations = new assignLocations();
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getEmployee();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
  }
  InitializeForm() {
    this.usersForm = this.fb.group({
      userID: [],
      UserName: ['', Validators.compose([Validators.required])],
      LoginName: ['', Validators.compose([Validators.required])],
      Password: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required])],
      ContactNo: ['', Validators.compose([Validators.required])],
      Address: [''],
      isActive: ['']
    });

  }

  openAddModal(content) {
    this.modalRef = this.modalService.open(content, { centered: false, });
    this.onEditShowHide = false;
    this.usersForm.reset();
  }

  saveEmployee() {
    if (this.usersForm.value.userID == null) {
      this.usersForm.value.userID = 0;
    }
    this.API.PostData(this.config.SAVE_EMPLOYEE, this.usersForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          if (data.isSaved == true) {
            this.toastr.success('Saved Successfully', 'Success');
            this.usersForm.controls.userID.setValue(data.ID);
            this.modalRef.close();
            this.getEmployee();
          }

          else {
            this.toastr.error(data.msg, 'Error');
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
  editEmployee(content, data) {
    this.modalRef = this.modalService.open(content, { centered: false});
    this.onEditShowHide = true;
    this.usersForm.patchValue(data);
    
  }

  getEmployee(){
    this.API.getdata(this.config.GET_EMPLOYEES).subscribe({
      next: (data) => {
        if (data != null) {
          this.destroyDT(0, true).then((destroyed) => {
            this.getEmployeeList = data;
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
  assignLocationpopup(content, data){
    this.modalRef = this.modalService.open(content, { centered: false});
    this.assignLocations.userID = data.userID;
    this.getassignLocationsByID(data.userID);
    this.getLocations();
  }
  onItemSelect(item: any) {
    this.assignLocations.locationList.push(item);
  }
  onSelectAll(items: any) {
    this.assignLocations.locationList = items;
  }
  ondeSelect(items: any) {
    this.assignLocations.locationList.splice(this.assignLocations.locationList.findIndex(ele => ele.locationID == items.locationID), 1);
  }
  assignLocation(){
    this.assignLocations.locationList = this.selectedLocations;
    this.API.PostData(this.config.ASSIGN_LOCATIONS, this.assignLocations).subscribe({
      next: (data) => {
        if (data != null) {
          if (data.isSaved == true) {
            this.toastr.success('Assigned Successfully', 'Success');
            this.modalRef.close();
          }
          else {
            this.toastr.error(data.msg, 'Error');
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
  getassignLocationsByID(userID: number) {
    this.API.getdata(this.config.GET_ASSIGN_LOCATIONS_BY_ID + userID).subscribe({
      next: (data) => {
        if (data != null) {
          this.selectedLocations = data;
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
