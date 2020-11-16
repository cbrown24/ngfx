import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../services/exchange.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversion } from '../models/conversion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  polledRate$: Observable<number>;
  previousConversions$: Observable<Conversion[]>;
  convertedValue$: Observable<number>;
  currentRate: number;
  toggled = false;
  diff = .05;
  eurRate = 1.1;
  usdRate = 1 / this.eurRate;
  amount = new FormControl(0);
  inputRate = new FormControl(0);
  rate = this.eurRate;
  prsub: Subscription;

  constructor(private exchangeService: ExchangeService) { }

  ngOnInit() {
    this.getRate();
    this.prsub = this.polledRate$.subscribe(rate => this.currentRate = rate);
    this.previousConversions$ = this.exchangeService.conversionsObserver;
    this.convertedValue$ = this.exchangeService.valueObserver;
  }

  relDiff(a, b) {
    return  100 * Math.abs( ( a - b ) / ( (a + b) / 2 ) );
   }

  getRate(): void {
    this.polledRate$ = timer(1, 3000).pipe( switchMap(() =>
          this.exchangeService.getRate(
            this.rate, this.diff, this.diff)
          ));
  }

  onSubmit() {
    const diff = this.relDiff(this.currentRate, +this.inputRate.value);
    const r: number = diff >= 2 ? this.currentRate : +this.inputRate.value;
    this.exchangeService.convert(+this.amount.value, r);
  }

  toggle() {
    this.toggled = !this.toggled;
    this.rate = this.toggled === true ? this.usdRate : this.eurRate;
    this.prsub.unsubscribe();
    this.inputRate.setValue(0);
    this.getRate();
    this.prsub = this.polledRate$.subscribe(rate => this.currentRate = rate);
  }
}
