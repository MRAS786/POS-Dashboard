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
    mcode: string;
    itemcode1: string;
    locationList:locationList [];
    categoryList:categoryList [];
    constructor(){
            this.locationList = [];
            this.categoryList = [];
    }
}

export interface BarInterface {
    lable: string;
    data: Array<number>;
    backgroundColor: string;
  }