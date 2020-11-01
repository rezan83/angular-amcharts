import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { of, forkJoin } from 'rxjs';
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
  chartForm: FormGroup;
  private chartInputs = {
    weekend_prod: 'No',
    sector: 'Haushalt',
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private consumptionDataService: ConsumptionDataService,
    private formBuilder: FormBuilder
  ) {
    this.chartForm = this.formBuilder.group({
      weekend_prod: new FormControl('No'),
      sector: new FormControl('Haushalt'),
    });
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // is this necessary?
  // ngAfterViewInit() {

  // Chart code goes in here
  drowChart(data) {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.fontSize = 15;
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
      timeAxis.dateFormats.setKey('hour', 'HH:mm');
      timeAxis.periodChangeDateFormats.setKey('hour', 'HH:mm');
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

      // werktag series ##################################
      let series = chart.series.push(new am4charts.LineSeries());
      series.name = 'Winter';
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
      bullet.tooltipText = 'Winter: {valueY}[/]';

      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.name = 'Rest';
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
      series2.legendSettings.itemValueText = '{valueY}';
      let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.stroke = interfaceColors.getFor('background');
      bullet2.circle.strokeWidth = 1;
      let bullet2hover = bullet2.states.create('hover');
      bullet2hover.properties.scale = 1.5;
      bullet2.tooltipText = 'Rest: {valueY}[/]';

      let series3 = chart.series.push(new am4charts.LineSeries());
      series3.name = 'Summer';
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
      series3.legendSettings.itemValueText = '{valueY}';
      let bullet3 = series3.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.stroke = interfaceColors.getFor('background');
      bullet3.circle.strokeWidth = 1;
      let bullet3hover = bullet3.states.create('hover');
      bullet3hover.properties.scale = 1.5;
      bullet3.tooltipText = 'Summer: {valueY}[/]';

      // Wochenende ###################################
      let series4 = chart.series.push(new am4charts.LineSeries());
      series4.name = 'Winter Wochenende';
      series4.dataFields.dateX = 'date';
      series4.dataFields.valueY = 'winterW';
      series4.tooltip.tooltipText = 'winterW:{valueY}';
      series4.tooltip.pointerOrientation = 'left';
      series4.tooltip.background.cornerRadius = 20;
      series4.tooltip.background.strokeOpacity = 0;
      series4.tooltip.label.minWidth = 40;
      series4.tooltip.label.minHeight = 40;
      series4.tooltip.label.textAlign = 'middle';
      series4.tooltip.label.textValign = 'middle';
      series4.legendSettings.itemValueText = '{valueY}';
      let bullet4 = series4.bullets.push(new am4charts.CircleBullet());
      bullet4.circle.stroke = interfaceColors.getFor('background');
      bullet4.circle.strokeWidth = 1;
      let bullet4hover = bullet4.states.create('hover');
      bullet4hover.properties.scale = 1.5;
      bullet4.tooltipText = 'Winter W: {valueY}[/]';

      let series5 = chart.series.push(new am4charts.LineSeries());
      series5.name = 'Rest Wochenende';
      series5.dataFields.dateX = 'date';
      series5.dataFields.valueY = 'restW';
      series5.tooltip.tooltipText = 'restW: {valueY }';
      series5.tooltip.background.cornerRadius = 20;
      series5.tooltip.background.strokeOpacity = 0;
      series5.tooltip.pointerOrientation = 'down';
      series5.tooltip.label.minWidth = 40;
      series5.tooltip.label.minHeight = 40;
      series5.tooltip.label.textAlign = 'middle';
      series5.tooltip.label.textValign = 'middle';
      series5.legendSettings.itemValueText = '{valueY}';
      let bullet5 = series5.bullets.push(new am4charts.CircleBullet());
      bullet5.circle.stroke = interfaceColors.getFor('background');
      bullet5.circle.strokeWidth = 1;
      let bullet5hover = bullet5.states.create('hover');
      bullet5hover.properties.scale = 1.5;
      bullet5.tooltipText = 'Rest W: {valueY}[/]';

      let series6 = chart.series.push(new am4charts.LineSeries());
      series6.name = 'Summer Wochenende';
      //   series6.stroke = am4core.color('#ff0000'); // red
      series6.dataFields.dateX = 'date';
      series6.dataFields.valueY = 'summerW';
      series6.strokeWidth = 3;
      series6.tooltip.tooltipText = 'summer Wochenende: {valueY }';
      series6.tooltip.background.cornerRadius = 20;
      series6.tooltip.background.strokeOpacity = 0;
      series6.tooltip.pointerOrientation = 'right';
      series6.tooltip.label.minWidth = 40;
      series6.tooltip.label.minHeight = 40;
      series6.tooltip.label.textAlign = 'middle';
      series6.tooltip.label.textValign = 'middle';
      series6.legendSettings.itemValueText = '{valueY}';
      let bullet6 = series6.bullets.push(new am4charts.CircleBullet());
      bullet6.circle.stroke = interfaceColors.getFor('background');
      bullet6.circle.strokeWidth = 1;
      let bullet6hover = bullet6.states.create('hover');
      bullet6hover.properties.scale = 1.5;
      bullet6.tooltipText = 'Summer W: {valueY}[/]';
      // ###################################

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

  // average weekend = sunday+saterday/2
  averageWochenende(arr1, arr2) {
    return arr1.map((item, i) => {
      return item + arr2[i] / 2;
    });
  }
  // serialize the fetched data for the chart
  serializeData(response1, response2) {
    let baseDate = '10/19/2020 ';
    let nextDate = '10/20/2020 ';
    let chartData = [];
    let dates = Object.values(response1.Winter[0].Time);
    let summerWerktag = Object.values(response1.Summer[0].Werktag);
    let winterWerktag = Object.values(response1.Winter[0].Werktag);
    let restWerktag = Object.values(response1.Rest[0].Werktag);

    let summerWochenende = this.averageWochenende(
      Object.values(response2.Summer[0].Samstag),
      Object.values(response2.Summer[0].Sonntag)
    );
    let winterWochenende = this.averageWochenende(
      Object.values(response2.Winter[0].Samstag),
      Object.values(response2.Winter[0].Sonntag)
    );
    let restWochenende = this.averageWochenende(
      Object.values(response2.Rest[0].Samstag),
      Object.values(response2.Rest[0].Sonntag)
    );

    for (let i in dates) {
      chartData.push({
        date: new Date(
          (dates[i] === '00:00:00' ? nextDate : baseDate) + dates[i]
        ),
        winter: winterWerktag[i],
        summer: summerWerktag[i],
        rest: restWerktag[i],
        winterW: winterWochenende[i],
        summerW: summerWochenende[i],
        restW: restWochenende[i],
      });
    }

    // this could still work statistically but unfaithful to the data
    // chartData.unshift(chartData.pop());

    // using 'of' to observe data
    return of(chartData);
  }

  // feeding chart with data
  fetchDatatoDrowChart(chartInputs = this.chartInputs): void {
    // join both services
    forkJoin(
      this.consumptionDataService.GetWerktag(chartInputs),
      this.consumptionDataService.GetWochenende(chartInputs)
    )
      .pipe(
        // drow the chart only after getting the data
        mergeMap(([data1, data2]) => {
          return this.serializeData(data1, data2);
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
    this.onChanges();
  }

  // when form inputs change
  onChanges(): void {
    this.chartForm.valueChanges.subscribe((val) => {
      this.chartInputs = val;
      this.ngOnDestroy();
      this.fetchDatatoDrowChart();
    });
  }
}
