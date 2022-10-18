import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ChartConfiguration,ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {
  coinData:any
  coinId!:string
  days:number = 1
  currency:string="INR"
  public lineChartData:ChartConfiguration['data']={
    datasets:[
     {
      data:[],
      label:'Price Trends',
      backgroundColor:'rgba(148,159,177,0.2)',
      borderColor:'#009688',
      pointBackgroundColor:'#009688',
      pointBorderColor:'#009688',
      pointHoverBackgroundColor:'#009688',
      pointHoverBorderColor:'#009688',
     } 
    ],
    labels:[]
  }

  public lineChartOptions:ChartConfiguration['options']={
    elements:{
      point:{
        radius:1
      }
    },
    scales:{

    },
    plugins:{
      legend:{
        display:true
      }
    }
  }

  public lineChartType:ChartType = 'line'

  @ViewChild(BaseChartDirective) myLineChart!:BaseChartDirective
  constructor(private api:ApiService,private activatedRoute:ActivatedRoute,private currencyService:CurrencyService) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(val=>
        this.coinId=val['id']
      )
    this.getGraphData(this.days)
    this.getCoinData()
    this.currencyService.getCurrency()
      .subscribe(val=>{
        this.currency = val
        this.getGraphData(this.days)
        this.getCoinData()
      })
  }

  getCoinData(){
    this.api.getCurrencybyId(this.coinId)
      .subscribe(res=>{
        if(this.currency==="USD"){
          res.market_data.current_price.inr = res.market_data.current_price.usd 
          res.market_data.market_cap.inr = res.market_data.market_cap.usd 
        }else{
          res.market_data.current_price.inr = res.market_data.current_price.inr 
          res.market_data.market_cap.inr = res.market_data.market_cap.inr
        }
        this.coinData=res

      })
  }

  getGraphData(selectedDays:number){
    this.days = selectedDays
    this.api.getGraphData(this.coinId,this.currency,selectedDays)
      .subscribe(res=>{
        setTimeout(()=>{this.myLineChart.update()},200)
        this.lineChartData.datasets[0].data = res.prices.map((data:any)=>{return data[1]})
        this.lineChartData.labels = res.prices.map((data:any)=>{
          let date = new Date(data[0])
          let time = date.getHours()>12 ?`${date.getHours()-12}:${date.getMinutes()} PM`:`${date.getHours()}:${date.getMinutes()} AM`
          return this.days===1?time:date.toLocaleDateString()
        })
      })
        
  }

}
