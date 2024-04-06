import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  constructor() { }
  getCurrentTime(): Observable<Date> {
    return interval(1000).pipe(
      map(() => new Date())
    );
  }
}
