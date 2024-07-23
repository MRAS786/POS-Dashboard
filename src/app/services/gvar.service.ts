import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RolesRequestModel } from '../shared/Roles';
import { Menu } from '../theme/components/menu/menu.model';
@Injectable({
  providedIn: 'root'
})
export class GvarService {
  // Hire in Search Data
  agencyID:string;
  ALCode:string;
  airportID:string;
  catID:string;
  fromDate:string;
  ToDate:string;
  hasValue:boolean;
  requestSearch:any;
  // End
  GoodsCallFrom: string;
  G_IsRunning: boolean = false;
  locationID: number;
  userName:string;
  UserId:string;
  serverURL: string = environment.serverURL;
  serverURLLogin: string = environment.serverURLLogin;
  constructor() { 
    this.userName=(localStorage.getItem('name'));
    this.UserId=(localStorage.getItem('userID'));
  }
  // Dynamic menu code

  setMenuItems(val: any) {
    const menuItems = localStorage.setItem('menuItems', JSON.stringify(val));
    return menuItems;
  }
  getMenuItems() {
    const getRoleAccess = JSON.parse(localStorage.getItem('menuItems'));
    return getRoleAccess;
  }
  removeMenuItems() {
    const removeMenuItems = localStorage.removeItem('menuItems');
    return removeMenuItems;
  }
  generateMenuItems(items) {
    const menu_items = [];
    for (let i = 0; i < items.length; i++) {
      menu_items[i] = new Menu(
        items[i].id,
        items[i].title,
        items[i].routerLink,
        items[i].href,
        items[i].icon,
        items[i].target,
        items[i].hasSubMenu,
        items[i].parentId);

    }
    return menu_items;
  }

  // Dynamic menu code end
  
}
