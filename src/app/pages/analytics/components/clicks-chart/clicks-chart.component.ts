import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class ClicksChartComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input({ required: true }) clicksOverTime: TimeSeriesPoint[] = [];
  @ViewChild('scrollWrapper') scrollWrapper!: ElementRef<HTMLDivElement>;

  chartOptions: any;
  chartWidth: string = '100%';

  private readonly MIN_POINTS_FOR_SCROLL = 7;
  private readonly PX_PER_POINT = 60;
  private shouldScroll = false;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
    this.shouldScroll = true; // marca que hay que hacer scroll al próximo check
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.scrollWrapper?.nativeElement) {
      this.scrollWrapper.nativeElement.scrollLeft = this.scrollWrapper.nativeElement.scrollWidth;
      this.shouldScroll = false;
    }
  }

  get needsScroll(): boolean {
    return this.clicksOverTime.length > this.MIN_POINTS_FOR_SCROLL;
  }

  private initChart() {
    const count = this.clicksOverTime.length;

    this.chartWidth = this.needsScroll
      ? `${count * this.PX_PER_POINT}px`
      : '100%';

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
        width: this.chartWidth,
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
          rotate: count > 5 ? -45 : 0,
          rotateAlways: count > 5,
          hideOverlappingLabels: false,
          trim: false,
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