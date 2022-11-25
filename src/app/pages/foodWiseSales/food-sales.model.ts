export class locationList  {
    locationID:number;
    locationName:string;
}
export class categoryList  {
    mcode:number;
    name:string;
}
export class grandSaleRequestModel{
    mFromDate:string;
    mToDate:string;
    locationList:locationList [];
    categoryList:categoryList [];
    constructor(){
            this.locationList = [];
            this.categoryList = [];
    }
}