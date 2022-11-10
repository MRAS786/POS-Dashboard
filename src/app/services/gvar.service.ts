import { Injectable } from '@angular/core';
import { CurrentUserViewModel } from '../Pages/Login/Model/Users'
import { environment } from '../../environments/environment';
import { RolesRequestModel } from '../shared/Roles'
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
  private Roles: RolesRequestModel[]
  G_IsRunning: boolean = false;
  locationID: number;
  userName:string;
  UserId:string;
  currentUser: CurrentUserViewModel;
  serverURL: string = environment.serverURL;
  serverURLLogin: string = environment.serverURLLogin;
  constructor() { 
    this.userName=(localStorage.getItem('userName'));
    this.UserId=(localStorage.getItem('UserId'));
  }
  roleMatch(allowedRoles): boolean {
    var temp = (localStorage.getItem('userRoles'));
    if (temp == "undefined") {
      return false
    }
    this.Roles = JSON.parse(localStorage.getItem('userRoles'));
 
    for (var i = 0; i < this.Roles.length; i++) {
      var checkRole = this.Roles[i].RoleId
      if (allowedRoles == this.Roles[i].RoleId) {
        return true
      }
    }
    return false
  }
  get canAddEdit() {
    return this.roleMatch(3);
  }
  get canDelete() {
    return this.roleMatch(4);
  }
  get canView() {
    return this.roleMatch(2);
  }
  get consignee() {
    return this.roleMatch(5);
  }
  get addeditConsignee() {
    return this.roleMatch(6);
  }
  get agentType() {
    return this.roleMatch(8);
  }
  get canAddEdit_AgentType() {
    return this.roleMatch(9);
  }
  get canDelete_AgentType() {
    return this.roleMatch(10);
  }
  get Agents() {
    return this.roleMatch(11);
  }
  get canAddEdit_Agents() {
    return this.roleMatch(12);
  }
  get canDelete_Agents() {
    return this.roleMatch(13);
  }
  get canView_AdminArea() {
    return this.roleMatch(15);
  }
  get canView_UDMMaster() {
    return this.roleMatch(16);
  }
  get canAddEdit_UDMMaster() {
    return this.roleMatch(17);
  }
  get canView_Commodity() {
    return this.roleMatch(18);
  }
  get canAddEdit_Commodity() {
    return this.roleMatch(19);
  }
  get canView_Vehicle() {
    return this.roleMatch(20);
  }
  get canAddEdit_Vehicle() {
    return this.roleMatch(21);
  }
  get canView_Forwader() {
    return this.roleMatch(22);
  }
  get canAddEdit_Forwader() {
    return this.roleMatch(23);
  }
  get canView_Goods() {
    return this.roleMatch(24);
  }
  get canAddEdit_Goods() {
    return this.roleMatch(25);
  }
  get canView_AirLines() {
    return this.roleMatch(26);
  }
  get canAddEdit_AirLines() {
    return this.roleMatch(27);
  }
  get canView_Acceptance() {
    return this.roleMatch(28);
  }
  get canAddEdit_Flights() {
    return this.roleMatch(30);
  }
  get canView_Flights() {
    return this.roleMatch(31);
  }
  get canView_BuildUP() {
    return this.roleMatch(53);
  }
  get canView_ULDRecieve() {
    return this.roleMatch(47);
  }
  get canView_ULDRequest() {
    return this.roleMatch(41);
  }
  get canView_ULDIssue() {
    return this.roleMatch(58);
  }
  get canView_Examination() {
    return this.roleMatch(33);
  }
  get canView_Scanning() {
    return this.roleMatch(35);
  }
  get canView_Manifest() {
    return this.roleMatch(57);
  }
  get canedit_departuredShipment() {
    return this.roleMatch(60);
  }
  get Assign_Roles() {
    return this.roleMatch(65);
  }
  get Manage_Group_Roles() {
    return this.roleMatch(66);
  }
  get viewMaster() {
    return this.roleMatch(67);
  }
  get viewDolly() {
    return this.roleMatch(73);
  }
  get viewAgency() {
    return this.roleMatch(75);
  }
  get viewGSECat() {
    return this.roleMatch(1079);
  }
  get viewHirein() {
    return this.roleMatch(77);
  }
  get canAddEdit_gseCat() {
    return this.roleMatch(1081);
  }
  get canAddEdit_gseMaster() {
    return this.roleMatch(1082);
  }
  get view_Reports() {
    return this.roleMatch(1083);
  }
  get view_AcceptanceReport() {
    return this.roleMatch(1084);
  }
  get viewWeightReport() {
    return this.roleMatch(1094);
  }
  
}
