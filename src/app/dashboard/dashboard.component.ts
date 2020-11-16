import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../services/exchange.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, timer, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversion } from '../models/conversion';
import { ActivatedRoute, Router } from '@angular/router';

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
  amount = new FormControl(0);
  inputRate = new FormControl(0);
  prsub: Subscription;

  from: string;
  to: string;

  fromRate: number;
  toRate: number;

  constructor(private exchangeService: ExchangeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.from = params.from;
      this.to = params.to;
      this.exchangeService.getCurrencies(this.from, this.to).subscribe( data => {
        this.fromRate = data.from.initialRate;
        this.toRate = data.to.initialRate;
        this.getRate();
        this.prsub = this.polledRate$.subscribe(rate => this.currentRate = rate);
        this.previousConversions$ = this.exchangeService.conversionsObserver;
        this.convertedValue$ = this.exchangeService.valueObserver;
      });

    });

  }

  relDiff(a, b) {
    return  100 * Math.abs( ( a - b ) / ( (a + b) / 2 ) );
   }

  getRate(): void {
    this.polledRate$ = timer(1, 3000).pipe( switchMap(() =>
          this.exchangeService.getRate(this.from)));
  }

  onSubmit() {
    if (+this.amount.value) {
      const diff = this.relDiff(this.currentRate, +this.inputRate.value);
      const r: number = diff >= 2 ? this.currentRate : +this.inputRate.value;
      this.exchangeService.convert(+this.amount.value, r);
    }
  }

  toggle() {
    this.prsub.unsubscribe();
    this.router.navigateByUrl(`/dashboard/${this.to}/${this.from}`);
  }
}
