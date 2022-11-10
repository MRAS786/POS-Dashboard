import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { HttpErrorResponse, } from '@angular/common/http';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


import { GvarService } from './gvar.service'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /* #region   constructor*/
  constructor(private httpClient: HttpClient, private router: Router,
    public Gv: GvarService) {
    this.displayHeaders();
  }
  /* #endregion */
  /* #region   getdata*/
  getdata(url: string): Observable<any> {
    this.Gv.G_IsRunning = true;
    let header = new HttpHeaders();
    let other_header = header.append('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    let FullUrl = this.Gv.serverURL + url;
    return this.httpClient.get(FullUrl, { headers: other_header }).pipe(map(response => {
      this.Gv.G_IsRunning = false;
      return response;
    }),
      catchError(x => this.handleAuthError(x)));
  }
  /* #endregion */
  /* #region   getdataWithParam*/
  getdataWithParam(url: string, param): Observable<any> {
    this.Gv.G_IsRunning = true;
    let FullUrl = this.Gv.serverURL + url;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    };
    return this.httpClient.get(FullUrl, param).pipe(
      retry(1),
      catchError(e => this.HttpErrHandler(e))
    );
  }
  /* #endregion */
  /* #region   PostData*/
  public PostData(urls, data): Observable<any> {
    this.Gv.G_IsRunning = true;
    let header = new HttpHeaders();
    let other_header = header.append('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    this.Gv.G_IsRunning = true;
    let FullUrl = this.Gv.serverURL + urls;
    return this.httpClient.post(FullUrl, data, { headers: other_header }).pipe(map(response => {
      this.Gv.G_IsRunning = false;
      return response;
    }),
      catchError(x => this.handleAuthError(x)));
  }
  
  public PostDataMultiple(urls, data,data2): Observable<any> {
    this.Gv.G_IsRunning = true;
    let header = new HttpHeaders();
    let other_header = header.append('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    this.Gv.G_IsRunning = true;
    let FullUrl = this.Gv.serverURL + urls;
    return this.httpClient.post(FullUrl, [data,data2], { headers: other_header }).pipe(map(response => {
      this.Gv.G_IsRunning = false;
      return response;
    }),
      catchError(x => this.handleAuthError(x)));
  }
  /* #endregion */
  /* #region   LoginUser*/
  public LoginUser(urls, data): Observable<any> {
    this.Gv.G_IsRunning = true;
    let header = new HttpHeaders();
    let other_header = header.append('Content-Type', 'application/json');
    let FullUrl = this.Gv.serverURLLogin + urls;
    return this.httpClient.post(FullUrl, data,{ headers: other_header }).pipe(map(response => {
      this.Gv.G_IsRunning = false;
      return response;
    }),
      catchError(e => this.HttpErrHandler(e))
    );
  }
  /* #endregion */
  /* #region   PostDataAttachmentResponse*/
  public PostDataAttachmentResponse(urls, data): Observable<HttpResponse<any> | Blob> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'responseType': 'blob'
      })
    }
    this.Gv.G_IsRunning = true;
    let FullUrl = this.Gv.serverURL + urls;
    return this.httpClient.post(FullUrl, data, { observe: 'response', responseType: 'blob' }).pipe(map(response => {
      this.Gv.G_IsRunning = false;
      return response;
    }),
      catchError(e => this.HttpErrHandler(e))
    );
  }
  /* #endregion */
  /* #region   getImage*/
  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }
  /* #endregion */
  /* #region   HttpAttachmentHandler*/
  HttpAttachmentHandler(res) {

    var data = { filename: '', content: res };

  }
  /* #endregion */
  /* #region   HttpErrHandler*/
  HttpErrHandler(res) {
    this.Gv.G_IsRunning = false;
    return observableThrowError(res);

  }
  /* #endregion */
  /* #region   displayHeaders*/
  displayHeaders() {
    let header = new HttpHeaders();
    let other_header = header.append('abc', '22');
  }
  /* #endregion */
  /* #region   handleAuthError*/
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      this.router.navigate(['/Dashboard']);
    }
    this.Gv.G_IsRunning = false;
    return throwError(err);
  }
  /* #endregion */
  /* #region   downloadFile*/
  public downloadFile(url: string, data): any {
    let FullUrl = this.Gv.serverURL + url;
    return this.httpClient.post(FullUrl, data, { responseType: 'blob' })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }
  /* #endregion */
}