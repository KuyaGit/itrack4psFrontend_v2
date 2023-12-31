import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Subscription, forkJoin } from 'rxjs';
import { Chart, registerables } from 'node_modules/chart.js'
import { getalluser } from 'src/app/services/data';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
Chart.register(...registerables)
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'accountsdetails_id',
    'name',
    'mobile_number',
    'address',
    'account_type',
  ];
  alluserData = new MatTableDataSource<getalluser>([]);
  constructor(
    private _analytics: AnalyticsService,
    private _dataService: DataService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.combinedSubscription()
    this.getallworking()
    this.get4psholderS()
    this.getStatus4()
    this.getallUser()
    this.getallstatussum()
    this.gettopschools()
    this.getChartData()
}
public isMobileLayout = false;
  ngAfterViewInit() {
    this.breakpointObserver.observe(["(max-width: 912px)"]).subscribe((res) => {
      if (res.matches) {
        this.isMobileLayout = true;
      } else {
        this.isMobileLayout = false;
      }
    });
    this.cdr.detectChanges();
    }
combinedSubscription() {
  const allStatusCount$ = this._analytics.allstatuscount();
  const status5$ = this._analytics.status5();

  forkJoin([allStatusCount$, status5$]).subscribe(
    ([allStatusCountResult, status5Result]) => {
      this.allstatusCount = allStatusCountResult.result[0].analytics_allstatuscount;
      this.beneficiaries = parseInt(this.allstatusCount);

      this.status5 = status5Result.result[0].analytics_status5;
      this.status5parse = parseInt(this.status5);

      this.renderPieChart();
    },
    (error) => {
      // Handle errors
      console.log(error);
    }
  );
}

private get_all_status_sum : Subscription = new Subscription();
countValues : any
allstatusSum: any
linechart: any;
renderLineChart() {
  this.linechart = new Chart("lineChart", {
    type: 'bar',
    data: {
      labels: ['Elementary Student', 'Elementary Graduate continue studying Junior High School', 'Junior High School Graduate continue studying Senior High School', 'Senior High School Graduate', 'Senior High School Graduate continue studying College', 'Senior High School Graduate continue studying TESDA', 'Junior High School Graduate continue studying TESDA', 'Senior High School Graduate Working Now', 'College Graduate', 'College Graduate and Working Now', 'TESDA Graduate', 'Junior High School Graduate Working Now'],
      datasets: [{
        label: 'Count of Beneficiaries Status',
        data: [],
        backgroundColor:["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"]
      }]
    }
  })
}
sum !: number
getallstatussum() {
  this.get_all_status_sum.add(
    this._analytics.allstatussum().subscribe(
      (result) => {
        this.allstatusSum = result.result[0];
        this.countValues = Object.values(this.allstatusSum); //convert object into array
        this.renderLineChart()
        if (this.linechart) {
          // Update the data property of the chart with the extracted data
          this.sum = this.countValues + 10
          this.linechart.data.datasets[0].data = this.countValues;
          this.linechart.update();
        }
      }
    )
  );
}


public mychart : any
renderPieChart() {
  this.mychart = new Chart("pieChart", {
    type: 'pie',
    data: {
      labels: ['Continue College', 'Beneficiaries'],
      datasets: [{
        label: 'Number of Beneficiaries',
        data: [this.status5parse,this.beneficiaries],
        borderWidth: 1,
        hoverOffset: 4
      }]
    },
  })
}


gettopschools() {
  this._analytics.topschools().subscribe(res => {
    const topschools = res['result'];

    this.doughnutChartData.datasets[0].data = [];
    this.doughnutChartData.labels = [];
    for (let school of topschools) {
      this.doughnutChartData.labels.push(school.schoolname);
      this.doughnutChartData.datasets[0].data.push(school.total);
    }

    this.mychart = new Chart("doughnutChart", {
      type: 'doughnut',
      data: {
        labels: this.doughnutChartData.labels,
        datasets: this.doughnutChartData.datasets
      },
    })
  });
}

lineData : any;
getChartData() {
  this._analytics.address().subscribe((res: { result: { year: number, month: string, address: string | null, total: number }[]}) => {
    const data = res.result;
    const uniqueMonths: string[] = Array.from(new Set(data.map(entry => entry.month.trim())));
    const uniqueAddresses: string[] = Array.from(new Set(data.map(entry => entry.address || 'Unknown')));

    const datasets: { label: string; data: number[]; fill: boolean }[] = [];

    uniqueAddresses.forEach(address => {
      const addressData: number[] = [];

      uniqueMonths.forEach(month => {
        const filteredEntries = data.filter(entry => entry.address === address && entry.month.trim() === month);
        const totalForMonth = filteredEntries.reduce((sum, entry) => sum + entry.total, 0);
        addressData.push(totalForMonth);
      });

      datasets.push({
        label: address || 'Unknown',
        data: addressData,
        fill: true,
      });
    });

    const lineChartData: ChartConfiguration['data'] = {
      datasets: datasets,
      labels: uniqueMonths,
    };

    this.lineChartData = lineChartData;
  });
}









public lineChartData: ChartConfiguration['data'] = {

  datasets: [
    {
      data: [],
      fill: 'origin',
    },
  ],
  labels: [],
};

public lineChartOptions: ChartConfiguration['options'] = {
  elements: {
    line: {
      tension: .1,
    },
  },
  scales: {
    // We use this empty structure as a placeholder for dynamic theming.
    y: {
      position: 'left',
    },
    y1: {
      position: 'right',
      grid: {
        color: 'rgba(255,0,0,0.3)',
      },
      ticks: {
        color: 'red',
      },
    },
  },

  plugins: {
    legend: { display: true },
  },
};

public lineChartType: ChartType = 'line';



public doughnutChartData: ChartData<'doughnut'> = {
  labels: [],
  datasets: [
    {data: []}
  ]
};
doughnutChartType: ChartType = 'doughnut';
// events

FourpsHolder:any = []
get4psholderS() {
  this.subs_get_4psholder.add(
    this._analytics.analytics_get4psholder()
    .subscribe(
      (result) => {
        this.FourpsHolder = result.result[0];
      }
    )
  )
}
status4 : any = []
getStatus4() {
  this.subs_get_4psholder.add(
    this._analytics.analytics_status4()
    .subscribe(
      (result) => {
        this.status4 = result.result[0];
      }
    )
  )
}

allstatusCount : any = [];
public beneficiaries : any = [];
getallStatuscount() {
  this.subs_get_4psholder.add(
    this._analytics.allstatuscount()
    .subscribe(
      (result) => {
        this.allstatusCount = result.result[0].analytics_allstatuscount;
        this.beneficiaries = parseInt(this.allstatusCount)
      }
    )
  )
}
private subs_get_4psholder: Subscription = new Subscription();
status5: any = []
public status5parse: any = []
getStatus5() {
  this.subs_get_4psholder.add(
    this._analytics.status5()
    .subscribe(
      (result) => {
            this.status5 = result.result[0].analytics_status5;
            this.status5parse = parseInt(this.status5);
      }
    )
  )
}


allworking: any = [];
senior!: number;
junior!: number;
college!: number;
public chartPie : any;

private sub_get_allworking : Subscription = new Subscription();
chartdata : any = []
barchart: any
getallworking() {
  this.sub_get_allworking.add(
    this._analytics.allworking().subscribe((result) => {
      this.allworking = result.result;
      this.senior = parseInt(this.allworking[0].count_8);
      this.junior = parseInt(this.allworking[0].count_12);
      this.college = parseInt(this.allworking[0].count_10);
      this.allworkingdata.datasets[0].data = [this.junior, this.senior, this.college];
      this.barchart = new Chart("workchart", {
        type: 'bar',
        data: {
          labels: ['Junior Highschool Graduate', 'Senior Highschool Graduate',  'College Graduate'],
          datasets: [{
            label: 'Beneficiaries Currently Working',
            data: [this.junior, this.senior, this.college],
            backgroundColor:["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"]
          }]
        }
      })
      // After data retrieval, call a function to render the bar chart

    })
  );
}

@ViewChild(BaseChartDirective) chart?: BaseChartDirective;
renderBarChart() {
  if (this.chart && this.chart.chart) {
    this.chart.chart.update();
  }
}


public allworkingdata: ChartData<'bar'> = {
  labels: ['Junior Highschool Graduate', 'Senior Highschool Graduate',  'College Graduate'],
  datasets: [
    {
      data: [],
      label: 'Beneficiaries Currently Working',
      backgroundColor: [
        'rgb(105,92,254)',
      ],
    },
  ],
};




  /** Based on the screen size, switch from standard to one column per row */
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,

    scales: {
      x: {},
      y: {
        min: 1,
        max: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];



  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }
  private subsription_get_all_user: Subscription = new Subscription();

  alluserList!: getalluser[];
  getallUser() {
    this.subsription_get_all_user.add(
      this._dataService.get_all_user().subscribe(
        (result) => {
          if (Array.isArray(result.result)) {
            this.alluserList = result.result;
            this.alluserList.forEach((user)=>{
              user.account_type = Number(user.account_type);
              user.accountTypeName = this.getAccountType(user.account_type);
            })
            if (this.paginator && this.sort) {
              this.alluserData = new MatTableDataSource(this.alluserList);
              this.alluserData.paginator = this.paginator;
              this.alluserData.sort = this.sort;
            }
          }
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }
  accountTypeText : string = ''

  accountTypeName : any [] = [
    { value : 1 ,
      text : 'Admin'
    },
    {
      value : 2,
      text : '4ps Staff'
    },
    {
      value : 3,
      text : 'Beneficiary'
    },
    {
      value : 4,
      text: 'School Registrar'
    }
  ];

  getAccountType(account_type: number): string {
    const status = this.accountTypeName.find(
      (option) => option.value === account_type
    );
    return status ? status.text : '';
  }
}
