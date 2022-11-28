export class locationList  {
    locationID:number;
    locationName:string;
}
export class ItemList  {
    SubCCode:number;
    Descr:string;
}
export class grandSaleRequestModel{
    mFromDate:string;
    mToDate:string;
    locationList:locationList [];
    ItemList:ItemList [];
    constructor(){
            this.locationList = [];
            this.ItemList = [];
    }
}