import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-device-chart',
  templateUrl: './device-chart.component.html',
  styleUrls: ['./device-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule, TranslatePipe, IonCard, IonCardTitle],
})
export class DeviceChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) deviceSplit: { mobile: number; desktop: number; tablet: number } = { mobile: 0, desktop: 0, tablet: 0 };

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    this.chartOptions = {
      series: [this.deviceSplit.desktop, this.deviceSplit.mobile, this.deviceSplit.tablet],
      labels: ['Desktop', 'Mobile', 'Tablet'],
      chart: {
        type: 'donut',
        height: 280,
        background: 'transparent',
      },
      colors: ['#5b4cf0', '#8b7cf6', '#c4b8fc'],
      legend: {
        position: 'bottom',
        labels: { colors: '#4b5563' },
        itemMargin: { horizontal: 12, vertical: 6 },
      },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#9ca3af',
                fontSize: '11px',
              },
            },
          },
        },
      },
      tooltip: {
        theme: 'light',
      },
    };
  }
}
