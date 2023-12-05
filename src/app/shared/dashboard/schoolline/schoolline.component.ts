import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-schoolline',
  templateUrl: './schoolline.component.html',
  styleUrls: ['./schoolline.component.scss']
})
export class SchoollineComponent implements OnInit{

  constructor(
    private _analytics: AnalyticsService
  ) {}
  ngOnInit(): void {
    this._analytics.topschools().subscribe(res => {
      const topschools = res['result'];
      this.doughnutChartData.datasets[0].data = [];
      this.doughnutChartData.labels = [];
      for (let school of topschools) {
        this.doughnutChartData.labels.push(school.schoolname);
        this.doughnutChartData.datasets[0].data.push(school.total);
      }
    });
  }
  // Doughnut
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {data: []}
    ]
  };
  doughnutChartType: ChartType = 'doughnut';
  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }
}
