import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { accountdetails, getalluser, holder } from 'src/app/services/data';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiaryregComponent } from 'src/app/shared/beneficiaryreg/beneficiaryreg.component';
import { UpdateModeEnum } from 'chart.js';
import { UpdateinfoComponent } from 'src/app/shared/holder/updateinfo/updateinfo.component';
import { InformationComponent } from 'src/app/shared/holder/information/information.component';
import { ProfileSettingComponent } from '../../../../shared/profile-setting/profile-setting.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Component({
  selector: 'app-beneficiary-form',
  templateUrl: './beneficiary-form.component.html',
  styleUrls: ['./beneficiary-form.component.scss']
})
export class BeneficiaryFormComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
  fname = (JSON.parse(this.id)).fname;
  lname = (JSON.parse(this.id)).lname;
  profile_piclink = (JSON.parse(this.id)).profile_piclink;
  typeAccount = (JSON.parse(this.id)).typeAccount;


  alluserData = new MatTableDataSource<getalluser>([]);
  archivedHolder = new MatTableDataSource<holder>([]);
  displayedColumns: any[] = [
    'accountuser_id',
    'name',
    'address',
    'mobile_number',
    'created',
    'actions'
  ];

  private subsription_get_all_user: Subscription = new Subscription();

  constructor (
    private _dataService: DataService,
    public dialog : MatDialog,
    private _alertService: AlertServiceService,
    private breakpointObserver: BreakpointObserver,
    private cdr : ChangeDetectorRef,
    private router : Router
  ) {}
  ngOnInit(): void {
    this.getAllbeneficiary();
    console.log(this.fname)
  }
  
  alluserList!: getalluser[]
  getAllbeneficiary() {
    this.subsription_get_all_user.add(
      this._dataService.getholder().subscribe(
        (result) => {
          if (Array.isArray(result.result)) {
            this.alluserList = result.result
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
  allarchivedHolder!: holder[]
  getholderArchived() {
    this.archived = true;
    this.subsription_get_all_user.add(
      this._dataService.getholderarchived().subscribe(
        (result) => {
          if (Array.isArray(result.result)) {
            this.allarchivedHolder = result.result
            if (this.paginator && this.sort) {
              this.archivedHolder = new MatTableDataSource(this.allarchivedHolder);
              this.archivedHolder.paginator = this.paginator;
              this.archivedHolder.sort = this.sort;
            }
          }
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }
restoreholder(householdid : string){
  this._alertService.simpleAlert(
    'warning',
    'Warning',
    'Are you sure you want to restore this user?',
    () => {
      this._dataService.restoreholder(householdid).subscribe(
        (result) => {
          if (result && result.status === '200') {
            this.handleSuccess('User profile deleted successfully');
            this.getholderArchived();
          } else {
            this.handleError('Failed to delete user profile');
          }
        },
        (error) => {
          this.handleError(
            'An error occurred while deleting the user profile'
          );
          console.error(error);
        }
  )},
  )
  
}
deleteuser(householdid: string) {
    this._alertService.simpleAlert(
      'warning',
      'Warning',
      'Are you sure you want to delete this user?',
      () => {
        this._dataService.deleteholderprofile(householdid).subscribe(
          (result) => {
            if (result && result.status === '200') {
              this.handleSuccess('User profile deleted successfully');

              this.getAllbeneficiary();
            } else {
              this.handleError('Failed to delete user profile');
            }
          },
          (error) => {
            this.handleError(
              'An error occurred while deleting the user profile'
            );
            console.error(error);
          }
        );
      },
      () => {
        console.log('Action canceled.');
      }
    );
  }
createbeneficiary(){
    this.createItemDialog(BeneficiaryregComponent)
    this.getAllbeneficiary();
}
viewItem(householdid: any) {
    this.viewItemDialog(householdid, '4ps Holder Information', InformationComponent);
}

updateItem(accountuser_id: any) {
  this.viewItemDialog(accountuser_id, 'Edit Information', UpdateinfoComponent);
}


viewItemDialog(householdid: string, title: string, component: any) {
  var _popup = this.dialog.open(component, {
    width: '80%',
    data: {
      title: title,
      code: householdid,
    }
  });
  _popup.afterClosed().subscribe(item => {
    this.getAllbeneficiary();
  })
}
profilesettings(){
  this.createItemDialog(ProfileSettingComponent)
}

createItemDialog(component: any) {
    var _popup = this.dialog.open(component, {
      width: '80%',
    });
    _popup.afterClosed().subscribe(item => {
      this.getAllbeneficiary();
    })
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.alluserData.filter = filterValue.trim().toLowerCase();
}

archived : boolean = false;


private handleError(message: string) {
  this._alertService.simpleAlert('error', 'Error', message);
}
private handleSuccess(message: string) {
  this._alertService.simpleAlert('success', 'Success', message);
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
}
