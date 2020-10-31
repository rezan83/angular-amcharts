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
    let dateBase = '10/19/2020 ';
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
        date: new Date(dateBase + dates[i]),
        winter: winterWerktag[i],
        summer: summerWerktag[i],
        rest: restWerktag[i],
      });
    }

    chartData.unshift(chartData.pop());
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
      chart.data = data;

      let title = chart.titles.create();
      title.text = 'Energieverbrauch';
      title.tooltipText =
        'Energieverbrauch an einem durchschnittlichen Tag für jede Jahreszeit';
      chart.tooltip.label.maxWidth = 250;
      chart.tooltip.label.wrap = true;

      let interfaceColors = new am4core.InterfaceColorSet();
      chart.paddingRight = 20;
      chart.colors.step = 4;

      let timeAxis = chart.xAxes.push(new am4charts.DateAxis());
      timeAxis.baseInterval = {
        timeUnit: 'minute',
        count: 15,
      };
      timeAxis.title.text = 'Std';
      timeAxis.renderer.minGridDistance = 50;
      timeAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 60;

      let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.tooltip.disabled = true;
      valueAxis2.renderer.minWidth = 60;

      let valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis3.tooltip.disabled = true;
      valueAxis3.renderer.minWidth = 60;

      let series = chart.series.push(new am4charts.LineSeries());
      series.name = 'winter';
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'winter';
      series.tooltip.tooltipText = 'winter:{valueY}';
      series.tooltip.pointerOrientation = 'left';
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = 'middle';
      series.tooltip.label.textValign = 'middle';
      series.legendSettings.itemValueText = '{valueY}';
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = interfaceColors.getFor('background');
      bullet.circle.strokeWidth = 1;
      let bullet1hover = bullet.states.create('hover');
      bullet1hover.properties.scale = 1.5;
      bullet.tooltipText = 'Winter: [bold]{valueY}[/]';

      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.name = 'rest';
      series2.dataFields.dateX = 'date';
      series2.dataFields.valueY = 'rest';
      series2.tooltip.tooltipText = 'rest: {valueY }';
      series2.tooltip.background.cornerRadius = 20;
      series2.tooltip.background.strokeOpacity = 0;
      series2.tooltip.pointerOrientation = 'vertical';
      series2.tooltip.label.minWidth = 40;
      series2.tooltip.label.minHeight = 40;
      series2.tooltip.label.textAlign = 'middle';
      series2.tooltip.label.textValign = 'middle';
      let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.stroke = interfaceColors.getFor('background');
      bullet2.circle.strokeWidth = 1;
      let bullet2hover = bullet2.states.create('hover');
      bullet2hover.properties.scale = 1.5;
      bullet2.tooltipText = 'Rest: [bold]{valueY}[/]';

      let series3 = chart.series.push(new am4charts.LineSeries());
      series3.name = 'summer';
      //   series3.stroke = am4core.color('#ff0000'); // red
      series3.dataFields.dateX = 'date';
      series3.dataFields.valueY = 'summer';
      series3.strokeWidth = 3;
      series3.tooltip.tooltipText = 'summer: {valueY }';
      series3.tooltip.background.cornerRadius = 20;
      series3.tooltip.background.strokeOpacity = 0;
      series3.tooltip.pointerOrientation = 'right';
      series3.tooltip.label.minWidth = 40;
      series3.tooltip.label.minHeight = 40;
      series3.tooltip.label.textAlign = 'middle';
      series3.tooltip.label.textValign = 'middle';
      let bullet3 = series3.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.stroke = interfaceColors.getFor('background');
      bullet3.circle.strokeWidth = 1;
      let bullet3hover = bullet3.states.create('hover');
      bullet3hover.properties.scale = 1.5;
      bullet3.tooltipText = 'Summer: [bold]{valueY}[/]';

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.maxTooltipDistance = 50;

      // zooming scrollbar
      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
      //   chart legends
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
