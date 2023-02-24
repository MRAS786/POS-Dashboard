export class locationList  {
    locationID:number;
    locationName:string;
}
export class ItemList  {
    SubCCode:number;
    Descr:string;
}
export class categoryList  {
    mcode:number;
    name:string;
}
export class grandSaleRequestModel{
    mFromDate:string;
    mToDate:string;
    itemcode1: string;
    locationList:locationList [];
    ItemList:ItemList [];
    constructor(){
            this.locationList = [];
            this.ItemList = [];
    }
}