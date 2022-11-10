export class UserModel{
    username: string ="";
    password: string= "";
    location: string = "";
    constructor() {
      this.location="Rawalpindi";
    }
  }
  export class CurrentUserViewModel {
    exp: number;
    iat: number;
    nbf: number;
    unique_name: string;
    role: string;
}
export class Location { 
  constructor(public locID:string, public locName:string) {
  }	
}
export class TokenRequestModel {
  Grant_Type:string;
  ClientId:string;
  Password:string;
  Refresh_Token:string;
  Username:string;

}