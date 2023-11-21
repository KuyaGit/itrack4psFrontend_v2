import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { accountuser } from './data';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private url = environment.server_link;

  constructor(
    private http: HttpClient
  ) {}

  public register( accountuser: any ) : Observable<any> {
    return this.http.
    post(this.url,
      accountuser,
      );
  }
  public addholder (holder: any): Observable<any> {
    return this.http.post(this.url + '/api/admin/addholder', holder)
    .pipe(catchError(this.handleError));
  }
  
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
