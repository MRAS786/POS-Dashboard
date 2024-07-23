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
import { userrequestModel } from './users.model';

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
  userrequestModel: userrequestModel;
  selectedLocations:any = [];
  listAllGroups: any = [];
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
    this.listAllGroups = [];
    this.userrequestModel = new userrequestModel();
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
      empID: [],
      loginName: ['', Validators.compose([Validators.required])],
      EmployeeName: ['', Validators.compose([Validators.required])],
      empPassword: ['', Validators.compose([Validators.required])],
      retypePass: [''],
      DesignationTitle: ['', Validators.compose([Validators.required])],
      contactNo: ['', Validators.compose([Validators.required])],
      Gender: [''],
      locationID: [''],
      groupid: [''],
      isActive: [''],
    });

  }

  openAddModal(content) {
    this.modalRef = this.modalService.open(content, { centered: false, });
    this.onEditShowHide = false;
    this.usersForm.reset();
    this.getLocations();
    this.getGroupsRole();
    this.usersForm.controls.empPassword.enable();
  }
  getGroupsRole() {
    this.API.getdata(this.config.GET_GROUP).subscribe({
      next: (data) => {
        if (data != null) {
          this.listAllGroups = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.warning(error.error.Message, 'Alert');
        }
      }
    });
  }
  onChangeLoc(locationID){
    this.usersForm.controls.locationID.setValue(Number(locationID));
  }
  onChangeGroup(groupid){
    this.usersForm.controls.groupid.setValue(Number(groupid));
  }
  saveEmployee() {
    if (this.usersForm.value.empID == null) {
      this.usersForm.controls.empID.setValue(0);
    }
    this.userrequestModel.empID = Number(this.usersForm.controls.empID.value);
    this.userrequestModel.EmployeeName = this.usersForm.controls.EmployeeName.value;
    this.userrequestModel.DesignationTitle = this.usersForm.controls.DesignationTitle.value;
    this.userrequestModel.loginName = this.usersForm.controls.loginName.value;
    this.userrequestModel.empPassword = this.usersForm.controls.empPassword.value;
    this.userrequestModel.contactNo = this.usersForm.controls.contactNo.value;
    this.userrequestModel.Gender = this.usersForm.controls.Gender.value;
    this.userrequestModel.groupid = this.usersForm.controls.groupid.value;
    this.userrequestModel.locationID = Number(this.usersForm.controls.locationID.value);
    this.userrequestModel.isActive = this.usersForm.controls.isActive.value;
    this.API.PostData(this.config.SAVE_EMPLOYEE, this.userrequestModel).subscribe({
      next: (data) => {
        if (data != null) {
          if (data.isSaved == true) {
            this.toastr.success('Saved Successfully', 'Success');
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
    this.getUserInfo(data.empID);
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
  onItemSelectStations(item: any) {
    this.userrequestModel.userBranches.push(item);
  }
  onItemDeSelectStations(item: any) {
    this.userrequestModel.userBranches
      .splice(this.userrequestModel.userBranches
        .findIndex(ele => ele.locationID == item.locationID), 1);
  }
  onItemDeSelectAllStations(item: any) {
    this.userrequestModel.userBranches = [];
  }
  onSelectAllStations(items: any) {
    this.userrequestModel.userBranches = items;
  }
  assignLocation(){
    this.userrequestModel.userBranches = this.selectedLocations;
    this.API.PostData(this.config.ASSIGN_LOCATIONS, this.userrequestModel).subscribe({
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

  getUserInfo(empID) {
    this.API.getdata(this.config.GET_USER_INFO + empID).subscribe({
      next: (data) => {
        if (data != null) {
          this.getLocations();
          this.usersForm.patchValue(data);
          this.selectedLocations = data.userBranches;
          this.userrequestModel.userBranches = this.selectedLocations;
          this.usersForm.controls.empPassword.disable();
          
          this.getGroupsRole();
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.warning(error.error.Message, 'Alert');
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
