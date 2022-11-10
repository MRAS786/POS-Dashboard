import { Component, ElementRef, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppGlobal } from 'src/app/services/app.global';
import { AuthService } from 'src/app/services/auth.service';
import { GvarService } from 'src/app/services/gvar.service';
import { ShareService } from 'src/app/services/share.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {
  modalRef: NgbModalRef;
  StationName: string = "";
  private setMini: boolean = false;
  UserName: any;
  UserId: any;
  constructor(
    public API: ApiService,
    private authService: AuthService,
    private router: Router,
    private shared: ShareService,
    public GV: GvarService,
    private config: AppGlobal,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.UserName = localStorage.getItem('name');
    this.UserId = localStorage.getItem('userID');
  }
  onClickLogout() {
    this.modalRef.close();
    this.authService.Logout();
    this.router.navigateByUrl('/login');
  }
  openLogoutModal(content) {
    this.modalRef = this.modalService.open(content, { centered: false, size: 'sm' });

  }
}
