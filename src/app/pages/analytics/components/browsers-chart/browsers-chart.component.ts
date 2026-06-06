import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BrowserStat } from 'src/app/Dtos/interfaces';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-browsers-chart',
  templateUrl: './browsers-chart.component.html',
  styleUrls: ['./browsers-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule, TranslatePipe, IonCard, IonCardTitle],
})
export class BrowsersChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) browsers: BrowserStat[] = [];

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    const top5 = this.browsers.slice(0, 5);
    this.chartOptions = {
      series: [{ name: 'Clicks', data: top5.map(b => b.clicks) }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: ['#5b4cf0'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '60%',
        },
      },
      xaxis: {
        categories: top5.map(b => b.name),
        labels: {
          style: { fontSize: '11px', colors: '#9ca3af' },
        },
      },
      yaxis: {
        labels: {
          style: { fontSize: '11px', colors: '#4b5563' },
        },
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' },
    };
  }
}
