import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GvarService } from 'src/app/services/gvar.service';
import { requestGroup } from './groupModal';
import { AppGlobal } from 'src/app/services/app.global';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  modalRef: NgbModalRef;
  intitalState: any;

  addMode: boolean = false;
  submitted: boolean = false;
  groupsForm: UntypedFormGroup;
  isShow: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  listAllGroups: any = [];
  listAllScreens: any = [];
  groupId = 0;
  requestGroup: requestGroup;
  setRoles: any = [];
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private config: AppGlobal,
    private router: Router) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      dom: 'Blfrtip',
    };

    this.listAllGroups = [];
    this.listAllScreens = [];
    this.requestGroup = new requestGroup();
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getGroupsRole();

  }
  InitializeForm() {
    this.groupsForm = new UntypedFormGroup({
      groupId: new UntypedFormControl(""),
      GroupName: new UntypedFormControl("", [Validators.required, this.noWhitespaceValidator]),
      UserID: new UntypedFormControl(""),
    });
  }
  public noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.groupsForm.controls; }

  saveGroupRoles() {
    this.submitted = true;
    if (this.groupsForm.valid) {
      this.requestGroup.GroupId = this.groupsForm.controls.groupId.value;
      this.requestGroup.GroupName = this.groupsForm.controls.GroupName.value;
      this.requestGroup.UserID = localStorage.getItem('userID');
      this.API.PostData(this.config.SAVE_GROUP, this.requestGroup).subscribe({
        next: (data) => {
          if (data != null) {
            if (data.Status == 1) {
              this.toastr.error(data.Message, 'Error');
              return;
            }
            this.toastr.success(data.Message, 'Success');
            this.isShow = !this.isShow;
            this.modalRef.close();
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
  }

  editGroups(content, p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.groupsForm.controls.groupId.patchValue(p.groupid);
    this.groupsForm.controls.GroupName.patchValue(p.groupName);
    this.modalRef = this.modalService.open(content, { centered: false, size: 'lg' });
    this.getUsernu(p.groupid);
  }

  addNewGroups(content) {
    this.groupsForm.reset();
    this.groupsForm.controls.groupId.setValue(0);
    this.isShow = !this.isShow;
    this.addMode = false;
    this.modalRef = this.modalService.open(content, { centered: false, size: 'lg' });
    this.getUsernu(0);
  }


  getGroupsRole() {
    this.API.getdata(this.config.GET_GROUP).subscribe({
      next: (data) => {
        if (data != null) {
          this.destroyDT(0, false).then(destroyed => {
            this.listAllGroups = data;
            this.dtTrigger.next(0);
          });
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.warning(error.error.Message, 'Alert');
        }
      }
    });
  }

  getUsernu(groupId) {
    this.listAllScreens = [];
    this.API.getdata(this.config.GET_GROUP_ROLES + groupId).subscribe({
      next: (data) => {
        if (data != null) {
          this.listAllScreens = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.message, 'Error');
        }
      }
    });
  }

  menuSelected() {
    let allData: any = [];
    allData = this.listAllScreens
    this.requestGroup.vuserMenu = allData;
  }



  destroyDT = (tableIndex: any, clearData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
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
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };

}
