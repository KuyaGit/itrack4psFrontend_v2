import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { DataService } from 'src/app/services/data.service';
import { CreateComponent } from 'src/app/shared/achievements/create/create.component';
@Component({
  selector: 'app-childachievements',
  templateUrl: './childachievements.component.html',
  styleUrls: ['./childachievements.component.scss']
})
export class ChildachievementsComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _dataService: DataService,
    private breakpointObserver: BreakpointObserver,
    private cdr : ChangeDetectorRef,
    private _alertService: AlertServiceService,
    public dialog: MatDialog,
    public formbuilder: FormBuilder,
  ) {

  }
  ngOnInit(): void {
    this.getChildachievement();
  }

  viewItem(child_id: any) {
    console.log(child_id)
  }
  displayedColumns: string[] = [
    'child_id',
    'achievement_name',
    'achievement_desc',
    'view'
  ]

  private subscription = new Subscription();
  alluserList: any[] = [];
  alluserData = new MatTableDataSource<any>([]);
  child_id: any;
  getChildachievement() {
    this.activatedRoute.params.subscribe(params=>{
      this.child_id = params.id
    })
    this.subscription.add(
      
      this._dataService.getchildachievements(this.child_id).subscribe(
        (result) => {
          console.log("this.alluserList")
          if (Array.isArray(result.result)) {
            this.alluserList = result.result;
            console.log(this.alluserList)
            console.log("this.alluserList")
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


  downloadCertificate(item: any) {
    // Assuming achievements_file contains the URL or path to the file
    const fileUrl = item;

    // Open the file in a new window or tab
    window.open(fileUrl, '_blank');
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
addchildchildachievements() {
    this.viewItemDialog('Add Child Achievement', CreateComponent);
}
viewItemDialog( title: string, component: any) {
  this.activatedRoute.params.subscribe(params=>{
    this.child_id = params.id
  })
  var _popup = this.dialog.open(component, {
    width: '80%',
    data: {
      title: title,
      code: this.child_id
    }
    
  });
  _popup.afterClosed().subscribe(item => {
    this.getChildachievement();
  })
} 
  
  
private handleError(message: string) {
  this._alertService.simpleAlert('error', 'Error', message);
}
private handleSuccess(message: string) {
  this._alertService.simpleAlert('success', 'Success', message);
}
}
