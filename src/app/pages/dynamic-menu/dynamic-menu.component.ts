import { Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, FormControl, UntypedFormBuilder, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Settings } from '../../app.settings.model';
import { AppSettings } from '../../app.settings';
import { Menu } from '../../theme/components/menu/menu.model';
import { MenuService } from '../../theme/components/menu/menu.service';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppGlobal } from 'src/app/services/app.global';
import { GvarService } from 'src/app/services/gvar.service';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dynamic-menu',
  templateUrl: './dynamic-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class DynamicMenuComponent implements OnInit {
  @ViewChild('backTop') private _selector: ElementRef;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  public form: FormGroup;
  public targets = ['_blank', '_self'];
  @Input() position: number = 400;
  @Input() showSpeed: number = 500;
  @Input() moveSpeed: number = 700;
  public icons = [
    { name: 'address-card-o', unicode: '&#xf2bc' },
    { name: 'bars', unicode: '&#xf0c9' },
    { name: 'bell-o', unicode: '&#xf0a2' },
    { name: 'calendar', unicode: '&#xf073' },
    { name: 'circle', unicode: '&#xf111' },
    { name: 'circle-o', unicode: '&#xf10c' },
    { name: 'cog', unicode: '&#xf013' },
    { name: 'comment', unicode: '&#xf075' },
    { name: 'comment-o', unicode: '&#xf0e5' },
    { name: 'credit-card', unicode: '&#xf09d' },
    { name: 'desktop', unicode: '&#xf108' },
    { name: 'exclamation-triangle', unicode: '&#xf071' },
    { name: 'folder', unicode: '&#xf07b' },
    { name: 'folder-o', unicode: '&#xf114' },
    { name: 'heart', unicode: '&#xf004' },
    { name: 'search', unicode: '&#xf002' }
  ]

  public menuItems: Array<Menu>;
  public settings: Settings;
  listParentMenu: any = [];
  listAllMenus: any = [];
  hideShow: boolean = true;
  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,
    public appSettings: AppSettings,
    public translateService: TranslateService,
    private menuService: MenuService,
    private toastr: ToastrService,
    private config: AppGlobal,
    public GV: GvarService,
    private API: ApiService,
    private modalService: NgbModal,) {
    this.settings = this.appSettings.settings;
    if (this.settings.theme.menu == 'vertical') {
      this.menuItems = this.menuService.getVerticalMenuItems();
    }
    if (this.settings.theme.menu == 'horizontal') {
      this.menuItems = this.menuService.getHorizontalMenuItems();
    }

    this.listParentMenu = [];
    this.listAllMenus = [];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      dom: 'Blfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    };


  }

  ngOnInit() {
    this.getParentMenu();
    this.form = this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      routerLink: null,
      href: null,
      icon: null,
      target: null,
      hasSubMenu: [''],
      parentId: 0,
      id: 0,
      sequence: ['', Validators.compose([Validators.required])],
      isActive: [''],
      showinMenu: ['']
    });

    this.getAllMenu();
  }

  ngAfterViewInit() {
    this.form.valueChanges.pipe(debounceTime(500)).subscribe(menu => {
      if (menu.routerLink && menu.routerLink != '') {
        this.form.controls['href'].setValue(null);
        this.form.controls['href'].disable();
        this.form.controls['target'].setValue(null);
        this.form.controls['target'].disable();
      }
      else {
        this.form.controls['href'].enable();
        this.form.controls['target'].enable();
      }

      if (menu.href && menu.href != '') {
        this.form.controls['routerLink'].setValue(null);
        this.form.controls['routerLink'].disable();
        this.form.controls['hasSubMenu'].setValue(false);
        this.form.controls['hasSubMenu'].disable();
      }
      else {
        this.form.controls['routerLink'].enable();
        this.form.controls['hasSubMenu'].enable();
      }
    })
  }
  onChange(event) {
    this.form.controls.parentId.setValue(Number(event));
  }
  public onSubmit(): void {
    if (this.form.valid) {
      // let lastId = this.menuItems[this.menuItems.length - 1].id;
      // let newMenuItem = new Menu(lastId + 1, menu['title'], menu['routerLink'], menu['href'], menu['icon'], menu['target'], menu['hasSubMenu'], parseInt(menu['parentId']));
      // this.menuService.addNewMenuItem(this.menuItems, newMenuItem, this.settings.theme.menu);
      if (this.form.controls.id.value == null) {
        this.form.controls.id.setValue(0);
      }
      if (this.form.controls.hasSubMenu.value == "") {
        this.form.controls.hasSubMenu.setValue(false);
      }
      this.API.PostData(this.config.SAVE_MENU, this.form.value).subscribe({
        next: (data) => {
          if (data.isSaved == true) {
            this.toastrService.success(data.msg, this.form.controls.title.value);
            this.resetForm();
            this.getAllMenu();
          }
          else {
            this.toastr.warning(data.msg, 'Alert');
          }
        },
        error: (error) => {
          if (error.error != undefined) {
            this.toastr.warning(error.error.msg, 'Alert');
          }
        }
      });
    }
  }

  getParentMenu() {
    this.API.getdata(this.config.GET_PARENT_MENU).subscribe({
      next: (data) => {
        if (data != null) {
          this.listParentMenu = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.warning(error.error.Message, 'Alert');
        }
      }
    });
  }
  getAllMenu() {
    this.API.getdata(this.config.GET_ALL_MENU).subscribe({
      next: (data) => {
        if (data != null) {
          this.listAllMenus = data;
        }
      },
      error: (error) => {
        if (error.error != undefined) {
          this.toastr.warning(error.error.Message, 'Alert');
        }
      }
    });
  }
  resetForm() {
    this.form.reset({
      hasSubMenu: false,
      parentId: 0
    });
    this.hideShow = true;
  }
  editMain(data) {
    this.form.patchValue(data);
    this.hideShow = false;
  }
  editSubMenu(data) {
    this.form.patchValue(data);
    this.hideShow = false;
  }

  _onClick(): boolean {
    jQuery('html, body').animate({ scrollTop: 0 }, { duration: this.moveSpeed });
    return false;
  }

  @HostListener('window:scroll')
  _onWindowScroll(): void {
    let el = this._selector.nativeElement;
    window.scrollY > this.position ? jQuery(el).fadeIn(this.showSpeed) : jQuery(el).fadeOut(this.showSpeed);
  }
}
