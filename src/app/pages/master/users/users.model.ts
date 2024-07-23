export class locationList {
    locationID: number;
    locationName: string
}

export class userrequestModel {
    empID: number;
    loginName: string;
    EmployeeName: string;
    empPassword: string;
    DesignationTitle: string;
    contactNo: string;
    Gender: string;
    isActive: boolean;
    isDeleted: boolean;
    groupid: number;
    locationID: number;
    userBranches: userBranches[];
    constructor() {
        this.userBranches = [];
    }

}

export class userBranches {
    id: number;
    locationID: number;
    empID: number;
    isdeleted: boolean;
    defaultLocation: number;
}