import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { __spread } from 'tslib';
import { Conversion } from '../models/conversion';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  conversions: Conversion[] = [];
  s: Subject<Conversion[]> = new Subject();
  conversionsObserver = this.s.asObservable();

  v: Subject<number> = new Subject();
  valueObserver = this.v.asObservable();

  constructor() { }

  getRate(rate: number, maxdiff: number, mindiff: number): Observable<any> {
    // TODO: Get from a propper conversion service
    return(of(
      parseFloat((Math.random() * ((rate + maxdiff) - (rate - mindiff)) + (rate - mindiff)).toFixed(2))
    ));
  }

  convert(amount: number, rate: number) {
    // TODO: Send to a propper conversion service
    const conversion = new Conversion(amount, rate, this.conversions.length);
    this.v.next(conversion.convertedValue);
    this.conversions.push(conversion);
    console.log(this.conversions);
    this.s.next(this.conversions.sort((obj1, obj2) => {
      if (obj2.index > obj1.index) {
        return -1;
      }
    }).slice(-5, this.conversions.length));
  }
}
