
export class Conversion {
    convertedValue: number;

    constructor(public amount: number, public exchangeRate: number, public index: number) {
        this.convertedValue = this.convertValue();
    }
    convertValue() {
      return(this.amount * this.exchangeRate);
    }
}