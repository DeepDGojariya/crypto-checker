import { Component } from '@angular/core';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedCurrency:string = "INR"
  constructor(private currencyService:CurrencyService){}

  setCurrency(event:string){
    this.selectedCurrency=event
    this.currencyService.setCurrency(this.selectedCurrency)
  }
}
