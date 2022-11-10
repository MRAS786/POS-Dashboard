export class locationList  {
    locationID:number;
    locationName:string;
}
export class grandSaleRequestModel{
    mFromDate:string;
    mToDate:string;
    locationList:locationList [];
    constructor(){
            this.locationList = [];
    }
}