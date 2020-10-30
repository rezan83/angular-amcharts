import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ConsumptionDataService } from '../consumption-data.service';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-consumption-chart',
  templateUrl: './consumption-chart.component.html',
  styleUrls: ['./consumption-chart.component.scss'],
})
export class ConsumptionChartComponent implements OnInit {
  private chart: am4charts.XYChart;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private consumptionDataService: ConsumptionDataService
  ) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

	// serialize the fetched data for the chart
  serializeData(response) {
    let dates = [];
    let summerWerktag = [];
    let winterWerktag = [];
    let restWerktag = [];
    let chartData = [];
    dates = Object.values(response.Winter[0].Time);
    summerWerktag = Object.values(response.Summer[0].Werktag);
    winterWerktag = Object.values(response.Winter[0].Werktag);
    restWerktag = Object.values(response.Rest[0].Werktag);

    for (let i in dates) {
      chartData.push({
        date: parseFloat(dates[i].slice(0, 5).replace(':', '.')),
        winter: winterWerktag[i],
        summer: summerWerktag[i],
        rest: restWerktag[i],
      });
    }

    chartData.unshift(chartData.pop());
    console.log('fetched Data', chartData);
    // using 'of' to observe data
    return of(chartData);
  }

  // is this necessary?
  // ngAfterViewInit() {

  // Chart code goes in here
  drowChart(data) {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('chartdiv', am4charts.XYChart);
      let title = chart.titles.create();
      title.text = 'Energy Consumption';
      title.tooltipText =
        'Energieverbrauch an einem durchschnittlichen Tag für jede Jahreszeit';
      chart.tooltip.label.maxWidth = 250;
      chart.tooltip.label.wrap = true;

      let interfaceColors = new am4core.InterfaceColorSet();

      chart.paddingRight = 20;
      chart.colors.step = 2;

      chart.data = data;

      console.log('chart.data', chart.data);

      let dateAxis = chart.xAxes.push(new am4charts.ValueAxis());
      dateAxis.max = 24;
      dateAxis.strictMinMax = true;
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.tooltip.disabled = true;
      valueAxis.showTooltipOn = 'always';
      valueAxis.renderer.minWidth = 60;

      let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.tooltip.disabled = true;
      valueAxis2.renderer.grid.template.strokeDasharray = '2,3';
      valueAxis2.renderer.minWidth = 60;

      let valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis3.tooltip.disabled = true;
      // valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 60;

      let series = chart.series.push(new am4charts.LineSeries());
      series.name = 'winter';
      series.dataFields.valueX = 'date';
      series.dataFields.valueY = 'winter';
      series.tooltip = new am4core.Tooltip();

      series.tooltipText = 'winter:{valueY}';

      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = 'middle';
      series.tooltip.label.textValign = 'middle';
      series.legendSettings.itemValueText = '{valueY}';
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = interfaceColors.getFor('background');
      bullet.circle.strokeWidth = 1;
      let bullet1hover = bullet.states.create('hover');
      bullet1hover.properties.scale = 1.3;

      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.name = 'summer';
      series2.dataFields.valueX = 'date';
      series2.dataFields.valueY = 'summer';
      series2.strokeWidth = 3;
      series2.tooltipText = 'summer: {valueY }';
      let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.stroke = interfaceColors.getFor('background');
      bullet2.circle.strokeWidth = 1;

      let series3 = chart.series.push(new am4charts.LineSeries());
      series3.name = 'rest';
      series3.dataFields.valueX = 'date';
      series3.dataFields.valueY = 'rest';
      series3.tooltipText = 'rest:{ valueY }';
      let bullet3 = series3.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.stroke = interfaceColors.getFor('background');
      bullet3.circle.strokeWidth = 1;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = 50;

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
      chart.legend = new am4charts.Legend();

      this.chart = chart;
    });
  }

// drow the chart only after getting the data
  fetchDatatoDrowChart(): void {
    this.consumptionDataService
      .sendGetRequest()
      .pipe(
        mergeMap((data) => {
          return this.serializeData(data);
        })
      )
      .subscribe((data) => {
        this.drowChart(data);
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

// componenet initialization
  ngOnInit(): void {
    this.fetchDatatoDrowChart();
  }
}
