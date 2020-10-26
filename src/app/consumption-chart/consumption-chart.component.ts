
import { Component, Inject, NgZone, PLATFORM_ID,OnInit,SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {ConsumptionDataService} from '../consumption-data.service'

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-consumption-chart',
  templateUrl: './consumption-chart.component.html',
  styleUrls: ['./consumption-chart.component.scss']
})
export class ConsumptionChartComponent implements OnInit {

	private chart: am4charts.XYChart
	private fdata: any = []

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone, private consumptionDataService: ConsumptionDataService) {}

	// Run the function only in the browser
	browserOnly(f: () => void) {
		if (isPlatformBrowser(this.platformId)) {
		  this.zone.runOutsideAngular(() => {
			f();
		  });
		}
	}

	serializeData(response){

		let dates = [];
		let summerWerktag = [];
		let winterWerktag = [];
		let restWerktag = [];
		let summerWerktagData = [];
		let winterWerktagData = [];
		let restWerktagData = [];
		dates = Object.values( response.Winter[0].Time);
		summerWerktag = Object.values(response.Summer[0].Werktag)
		winterWerktag = Object.values(response.Winter[0].Werktag)
		restWerktag = Object.values(response.Rest[0].Werktag)
		for(let i in dates){
			summerWerktagData.push({date: dates[i], summer: summerWerktag[i]})
			winterWerktagData.push({date: dates[i], winter: winterWerktag[i]})
			restWerktagData.push({date: dates[i], rest: restWerktag[i]})
		}

		let chartData = [...winterWerktagData, ...summerWerktagData, ...restWerktagData].slice(1, 50)
		console.log('chartData',chartData)
		return chartData
	}

	fetchData(chartData): any{
	this.consumptionDataService.sendGetRequest()
		.subscribe(data=> {
			chartData = this.serializeData(data)
			return chartData
		})
	
	}

	ngAfterViewInit() {
		// Chart code goes in here
		this.browserOnly(() => {



		am4core.useTheme(am4themes_animated);

		let chart = am4core.create("chartdiv", am4charts.XYChart);
			(async ()=> {
				let data = await this.fetchData(this.fdata)
				if(data.length){
					console.log("data")
				}
					chart.dataSource.load();
					am4charts.updateData()
				
			})()
		
			
		// if(this.fdata.length){
		// 	chart.dataSource.load();
		// }

	  chart.paddingRight = 20;

		let data2 = [{date: new Date(2018, 0, 1), winter: 60.8},
						{date: new Date(2018, 0, 2), winter: 54.9},
						{date: new Date(2018, 0, 3), winter: 49.9},
						{date: new Date(2018, 0, 4), winter: 46.2},
						{date: new Date(2018, 0, 5), winter: 43.6},
						{date: new Date(2018, 0, 6), winter: 41.9},
						{date: new Date(2018, 0, 7),winter: 40.8},
						{date: new Date(2018, 0, 8), winter: 40.1},
						{date: new Date(2018, 0, 9), winter: 39.6},
						{date: new Date(2018, 0, 10), winter: 39.4},
						{date: new Date(2018, 0, 11), winter: 39.1},
					]
		let data3 = [
						{date: "00:15:00", winter: 60.8},
						{date: "00:30:00", winter: 54.9},
						{date: "00:45:00", winter: 49.9},
						{date: "01:00:00", winter: 46.2},
						{date: "01:15:00", winter: 43.6},
						{date: "01:30:00", winter: 41.9},
						{date: "01:45:00", winter: 40.8},
						{date: "02:00:00", winter: 40.1},
						{date: "02:15:00", winter: 39.6},
						{date: "02:30:00", winter: 39.4},
						{date: "02:45:00", winter: 39.1},
					]

		// let data = [];

		// let visits = 10;
		// for (let i = 1; i < 366; i++) {
		// visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
		// data.push({ date: new Date(2018, 0, i), winter: visits });
		// }
		// chart.events.on("beforedatavalidated", function(ev) {
		//   // let source = ev.target.data;

		//   ev.target.data = this.fetchData(this.fdata);
		// });
	  chart.data = this.fdata
		// this.fetchData(this.fdata)
		console.log('chart.data',chart.data)

	  let dateAxis = chart.xAxes.push(new am4charts.DurationAxis());
	dateAxis.baseUnit = "second";
	  dateAxis.renderer.grid.template.location = 0;

		// let dateAxis2 = chart.xAxes.push(new am4charts.DateAxis());
		// dateAxis2.renderer.grid.template.location = 0;
		// dateAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");

	  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	  valueAxis.tooltip.disabled = true;
	  valueAxis.renderer.minWidth = 35;

		// let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
		// valueAxis2.tooltip.disabled = true;
		// valueAxis2.renderer.grid.template.strokeDasharray = "2,3";
		// valueAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");
		// valueAxis2.renderer.minWidth = 60;

	  let series = chart.series.push(new am4charts.LineSeries());
	  series.dataFields.valueX = "date";
	  series.dataFields.valueY = "winter";
	  series.tooltipText = "{valueY.winter}";

	  chart.cursor = new am4charts.XYCursor();

	  let scrollbarX = new am4charts.XYChartScrollbar();
	  scrollbarX.series.push(series);
	  chart.scrollbarX = scrollbarX;

	  this.chart = chart;

	});
	}

	ngOnDestroy() {
	// Clean up chart when the component is removed
	this.browserOnly(() => {
	  if (this.chart) {
		this.chart.dispose();
	  }
	});
	}






	ngOnInit(): void {
	  // this.fetchData(this.fdata)
		this.fetchData(this.chart.data)
	}


	ngAfterContentInit(){
	// this.fetchData(this.chart.data)
	}

}
