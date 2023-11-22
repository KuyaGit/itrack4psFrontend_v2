import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { MatDialog, } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChildbeneficiaryComponent } from 'src/app/shared/beneficiary/childbeneficiary/childbeneficiary.component';
import { Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service';

import { ActivatedRoute } from '@angular/router';
import { ViewchildComponent } from 'src/app/shared/beneficiary/viewchild/viewchild.component';
import { UpdateinfoComponent } from 'src/app/shared/holder/updateinfo/updateinfo.component';
import { InformationComponent } from 'src/app/shared/holder/information/information.component';
import { child_beneficiary, getalluser, holder } from 'src/app/services/data';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UpdateComponent } from 'src/app/shared/beneficiary/update/update.component';
@Component({
  selector: 'app-householdbeneficiary',
  templateUrl: './householdbeneficiary.component.html',
  styleUrls: ['./householdbeneficiary.component.scss']
})
export class HouseholdbeneficiaryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  hide = true;
  householdid: any;
  childbeneficiaryForm: FormGroup;  
    constructor(
      private breakpointObserver: BreakpointObserver,
      private cdr : ChangeDetectorRef,
      private activatedRoute: ActivatedRoute,
      public dialog: MatDialog,
      public formbuilder: FormBuilder,
      private _dataService: DataService,
      private _alertService: AlertServiceService
    ) {
      this.childbeneficiaryForm = this.formbuilder.group({
        householdid : [this.householdid],
        fname : ['', [Validators.required]],
        lname : ['', [Validators.required]],
        password: ['', [Validators.required,Validators.minLength(6)]],
        schoolName : ['', [Validators.required]],
      })
    }
  get form(): { [key: string]: AbstractControl } {
    return this.childbeneficiaryForm.controls;
  }
  inputdata : any;
  
  ngOnInit() {
    this.getChildsData()
    
  }

  addchildBeneficiary(householdid: string) {
    this.openDialog(householdid, 'Create 4ps Beneficiary', ChildbeneficiaryComponent)
  }

  openDialog(householdid: string, title : string, component: any) {
    let dialogRef = this.dialog.open(component,{
      width: '80%',
      data: {
        title: title,
        code: householdid
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.childbeneficiaryForm.reset();
      this.getChildsData()
    });
  }
  archived: boolean = false;
  dataInfo!: any;
  subscription: Subscription = new Subscription();
  user!: any;
  displayedColumns: any[] = [
    'child_id',
    'full_name',
    'status',
    'assigned',
    'actions'
  ];
  alluserData = new MatTableDataSource<child_beneficiary>([]);
  alluserList!: child_beneficiary[];
  getChildsData() {
    this.activatedRoute.params.subscribe(params=>{
      this.householdid = params.id
    })
    this.subscription.add(
      this._dataService.getbeneficiary(this.householdid).subscribe(
        (result) => {
          if (Array.isArray(result.result)) {
            this.alluserList = result.result;
            console.log(this.alluserList)
            this.alluserList.forEach((user)=>{
              user.status = Number(user.status)
              user.statusName = this.getStatusType(user.status);
            })
            if (this.paginator && this.sort) {
              console.log(this.alluserList)
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

updateItem(child_id: number) {
  this.viewItemDialog(child_id, 'Edit Information', UpdateComponent);
}


viewItem(child_id: any) {
    this.viewItemDialog(child_id, 'View Information', ViewchildComponent);
    this.getChildsData()
  }

  viewItemDialog(child_id: number, title: string, component: any) {
    var _popup = this.dialog.open(component, {
      width: '80%',
      data: {
        title: title,
        code: child_id
      }
      
    });
    _popup.afterClosed().subscribe(item => {
      this.getChildsData();
    })
  }
  statusText : string = ''

  statusName : any [] = [
    {
      value: 1,
      status: 'Elementary Student'
    },
    {
      value: 2,
      status: 'Elementary Graduate continue studying Junior High School'
    },
    {
      value: 3,
      status: 'Junior High School Graduate continue studying Senior High School'
    },
    {
      value: 4,
      status: 'Senior High School Graduate'
    },
    {
      value: 5,
      status: 'Senior High School Graduate continue studying College'
    },
    {
      value: 6,
      status: 'Senior High School Graduate continue studying TESDA'
    },
    {
      value: 7,
      status: 'Junior High School Graduate continue studying TESDA'
    },
    {
      value: 8,
      status: 'Senior High School Graduate Working Now'
    },
    {
      value: 9,
      status: 'College Graduate'
    },
    {
      value: 10,
      status: 'College Graduate and Working Now'
    },
    {
      value: 11,
      status: 'TESDA Graduate'
    },
    {
      value: 12,
      status: 'Junior High School Graduate Working Now'
    }
  ];
  getStatusType(status: number): string {
    const name = this.statusName.find(
      (option) => option.value === status
    );
    return name ? name.status : '';
  }
  deletechild(child_id: string) {
    this._alertService.simpleAlert(
      'warning',
      'Warning',
      'Are you sure you want to archived this user?',
      () => {
        this._dataService.deletechildprofile(child_id).subscribe(
          (result) => {
            if (result && result.status === '200') {
              this.handleSuccess('Child Beneficiary profile archived successfully');
              this.getChildsData();
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

    );
  }
  private subsription_get_childlistarchived: Subscription = new Subscription();
  allarchivedChild!: child_beneficiary[]
  archivedChild = new MatTableDataSource<child_beneficiary>([]);
  getholderArchived() {
    this.archived = true;
    this.subsription_get_childlistarchived.add(
      this._dataService.getchildarchived().subscribe(
        (result) => {
          if (Array.isArray(result.result)) {
            this.allarchivedChild = result.result
            if (this.paginator && this.sort) {
              this.archivedChild = new MatTableDataSource(this.allarchivedChild);
              this.archivedChild.paginator = this.paginator;
              this.archivedChild.sort = this.sort;
            }
          }
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }
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
