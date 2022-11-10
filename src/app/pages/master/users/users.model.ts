export class locationList  {
    locationID: number;
    locationName: string
}

export class assignLocations {
    userID : number;
    locationList : locationList [];;
    constructor() {
        this.locationList  = [];
    }
 
}