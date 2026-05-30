import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TimeSeriesPoint } from 'src/app/Dtos/interfaces';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-clicks-chart',
  templateUrl: './clicks-chart.component.html',
  styleUrls: ['./clicks-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule, TranslatePipe, IonCard, IonCardTitle],
})
export class ClicksChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) clicksOverTime: TimeSeriesPoint[] = [];

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    const labels = this.clicksOverTime.map(p => {
      const date = new Date(p.date);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    const data = this.clicksOverTime.map(p => p.clicks);

    this.chartOptions = {
      series: [{ name: 'Clicks', data }],
      chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
      },
      colors: ['#5b4cf0'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: labels,
        labels: {
          rotate: -45,
          style: { fontSize: '11px', colors: '#9ca3af' },
        },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: {
          style: { fontSize: '11px', colors: '#9ca3af' },
        },
        tickAmount: 4,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'light',
        marker: { show: false },
      },
    };
  }
}
