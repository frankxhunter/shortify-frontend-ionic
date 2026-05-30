import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-hourly-heatmap',
  templateUrl: './hourly-heatmap.component.html',
  styleUrls: ['./hourly-heatmap.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule, TranslatePipe, IonCard, IonCardTitle],
})
export class HourlyHeatmapComponent implements OnInit, OnChanges {
  @Input({ required: true }) hourlyHeatmap: number[] = [];

  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const data = this.hourlyHeatmap.length === 24
      ? this.hourlyHeatmap
      : Array(24).fill(0);

    const seriesData = data.map((clicks, index) => ({
      x: hours[index],
      y: clicks,
    }));

    this.chartOptions = {
      series: [{ name: 'Clicks', data: seriesData }],
      chart: {
        type: 'heatmap',
        height: 200,
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: ['#5b4cf0'],
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 4,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: '#f3f4f6', name: 'No clicks' },
              { from: 1, to: 10, color: '#e1dffc', name: 'Low' },
              { from: 11, to: 50, color: '#b8b3f7', name: 'Medium' },
              { from: 51, to: 100, color: '#8b7cf6', name: 'High' },
              { from: 101, to: 9999, color: '#5b4cf0', name: 'Very high' },
            ],
          },
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        labels: {
          style: { fontSize: '10px', colors: '#9ca3af' },
        },
      },
      yaxis: {
        labels: { show: false },
      },
      grid: { show: false },
      tooltip: { theme: 'light' },
      legend: { show: false },
    };
  }
}
