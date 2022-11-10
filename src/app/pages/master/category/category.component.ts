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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  modalRef: NgbModalRef;
  modalRef2: NgbModalRef;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  categoryForm: FormGroup;
  subcategoryForm: FormGroup;
  onEditShowHide: boolean = false;
  getCategoryList: any = [];
  getsubCategories: any = [];
  mainCategory: string;
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private config: AppGlobal,
    private GV: GvarService,
    private API: ApiService,
    private modalService: NgbModal
  ) {
    this.getCategoryList = [];
    this.getsubCategories = [];
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getCategory();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };
  }
  InitializeForm() {
    this.categoryForm = this.fb.group({
      categoryID: [],
      categoryName: ['', Validators.compose([Validators.required])],
    });

    this.subcategoryForm = this.fb.group({
      subcategoryID: [],
      categoryID: [''],
      subcatName: ['', Validators.compose([Validators.required])],
    });
  }
  openAddModal(content) {
    this.modalRef = this.modalService.open(content, { centered: false, size: 'sm' });
    this.onEditShowHide = false;
    this.categoryForm.reset();
  }
  saveCategory() {
    if (this.categoryForm.value.categoryID == null) {
      this.categoryForm.value.categoryID = 0;
    }
    this.API.PostData(this.config.SAVE_CATEGORY, this.categoryForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          if (data.isSaved == true) {
            this.toastr.success('Saved Successfully', 'Success');
            this.categoryForm.controls.categoryID.setValue(data.ID);
            this.modalRef.close();
            this.getCategory();
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
  getCategory() {
    this.API.getdata(this.config.GET_CATEGORY).subscribe({
      next: (data) => {
        if (data != null) {
          this.destroyDT(0, true).then((destroyed) => {
            this.getCategoryList = data;
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
  editCategory(content, data) {
    this.modalRef = this.modalService.open(content, { centered: false, size: 'sm' });
    this.onEditShowHide = true;
    this.categoryForm.patchValue(data);
  }

  addSubCategory(content, data) {
    this.modalRef2 = this.modalService.open(content, { centered: false, size: 'sm' });
    this.onEditShowHide = false;
    this.subcategoryForm.reset();
    this.subcategoryForm.controls.categoryID.setValue(data.categoryID);

  }

  viewSubCategory(content, data) {
    this.modalRef = this.modalService.open(content, { centered: false });
    this.mainCategory = data.categoryName;
    this.getSubCategories(data.categoryID);
  }
  getSubCategories(categoryID) {
    this.API.getdata(this.config.GET_SUB_CATEGORY_BY_ID + categoryID).subscribe({
      next: (data) => {
        if (data != null) {
          this.getsubCategories = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.error(error.error.Message, 'Error');
        }
      }
    });
  }
  saveSubCategory() {
    if (this.subcategoryForm.value.subcategoryID == null) {
      this.subcategoryForm.value.subcategoryID = 0;
    }
    this.API.PostData(this.config.SAVE_SUB_CATEGORY, this.subcategoryForm.value).subscribe({
      next: (data) => {
        if (data != null) {
          if (data.isSaved == true) {
            this.toastr.success('Saved Successfully', 'Success');
            this.subcategoryForm.controls.subcategoryID.setValue(data.ID);
            this.modalRef2.close();
            this.modalRef.close();
            this.getCategory();
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
  onEditSubCategory(content, data) {
    this.modalRef2 = this.modalService.open(content, { centered: false, size: 'sm' });
    this.onEditShowHide = true;
    this.subcategoryForm.patchValue(data);
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
