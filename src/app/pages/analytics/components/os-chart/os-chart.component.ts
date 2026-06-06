import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { OsStat } from 'src/app/Dtos/interfaces';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-os-chart',
  templateUrl: './os-chart.component.html',
  styleUrls: ['./os-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule, TranslatePipe, IonCard, IonCardTitle],
})
export class OsChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) osList: OsStat[] = [];

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    const top5 = this.osList.slice(0, 5);
    this.chartOptions = {
      series: [{ name: 'Clicks', data: top5.map(o => o.clicks) }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: ['#8b7cf6'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '60%',
        },
      },
      xaxis: {
        categories: top5.map(o => o.name),
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
