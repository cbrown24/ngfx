import { Injectable } from '@angular/core';
import { Observable, of, Subject, forkJoin } from 'rxjs';
import { Conversion } from '../models/conversion';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  conversions: Conversion[] = [];
  currencies: Currency[] = [ new Currency('eur', 1.1), new Currency('usd', 1 / 1.1)];

  s: Subject<Conversion[]> = new Subject();
  conversionsObserver = this.s.asObservable();

  v: Subject<number> = new Subject();
  valueObserver = this.v.asObservable();

  constructor() { }

  getRate(cur: string): Observable<any> {
    // TODO: Get from a propper conversion service
    const diff = 0.05;
    const currency = this.currencies.find( c => c.name === cur);
    const rate = currency.initialRate;
    return(of(
      parseFloat((Math.random() * ((rate + diff) - (rate - diff)) + (rate - diff)).toFixed(2))
    ));
  }

  getCurrencies(from: string, to: string): Observable<any> {
    return forkJoin({
      from: this.currencies.filter(currency => currency.name === from),
      to: this.currencies.filter(currency => currency.name === to)
    });
  }

  convert(amount: number, rate: number) {
    // TODO: Send to a propper conversion service
    const conversion = new Conversion(amount, rate, this.conversions.length);
    this.v.next(conversion.convertedValue);
    this.conversions.push(conversion);
    this.s.next(this.conversions.sort((obj1, obj2) => {
      if (obj2.index > obj1.index) {
        return -1;
      }
    }).slice(-5, this.conversions.length));
  }
}
