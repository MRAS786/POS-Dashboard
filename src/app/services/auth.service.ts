import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GvarService } from './gvar.service';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {


  constructor(private http: HttpClient, private httpClient: HttpClient, private router: Router,
    public Gv: GvarService) { }

  Token(username: any, password: any): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let FullUrl = this.Gv.serverURL + `/token?username=${username}&password=${password}&grant_type=password`;
    return this.http.get(FullUrl).pipe(
      catchError(e => this.HttpErrHandler(e))
    );
  }
  HttpErrHandler(res) {
    let errMsg;
    if (res.status === 404) {
      errMsg = 'NotFound Http Error ';
    }
    else if (res.status === 401) {

      errMsg = 'Invalid username of password';
    }
    else { errMsg = res.status + ' Unknown Http Error'; }
    return observableThrowError(errMsg);
  }

  Logout(): any {
    localStorage.removeItem('cu');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
