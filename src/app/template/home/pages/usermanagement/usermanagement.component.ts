import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { accountdetails, getalluser, schoolname } from 'src/app/services/data';
import { AddUserService } from 'src/app/services/add-user.service';
import { SchedulerAction, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchoolService } from 'src/app/services/school.service';
import { accountuser } from 'src/app/services/data';
import { RegisterService } from 'src/app/services/register.service';
import { InformationComponent } from 'src/app/shared/information/information.component';
import { UpdateinfoComponent } from 'src/app/shared/updateinfo/updateinfo.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})

export class UsermanagementComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  schoolnames: schoolname [] = []
  hide = true;
  createaccountForm: FormGroup;
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;

  displayedColumns: string[] = [
    'accountsdetails_id',
    'name',
    'mobile_number',
    'address',
    'account_type',
    'action',
  ];
  fileUrl = 'assets/default-profile-photo.png';
  imgUrl!: string;
  alluserData = new MatTableDataSource<getalluser>([]);
  constructor(
    private _alertService: AlertServiceService,
    public _addUserService: AddUserService,
    public _registerService: RegisterService,
    public dialog: MatDialog,
    public formbuilder: FormBuilder,
    private _dataService: DataService,
    private _schoolname: SchoolService,
    private breakpointObserver: BreakpointObserver,
    private cdr : ChangeDetectorRef
    )
    {
      this.createaccountForm = this.formbuilder.group({
        fName : ['', [Validators.required]],
        lName : ['', [Validators.required]],
        account_type: [2],
        profile_piclink: ['default.png'],
        email : ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        password: ['', [Validators.required,Validators.minLength(6)]],

      });
  }

  viewItem(accountuser_id: any) {
        this.viewItemDialog(accountuser_id, 'User Information', InformationComponent);
  }

  updateItem(accountuser_id: any) {
    this.viewItemDialog(accountuser_id, 'Edit Information', UpdateinfoComponent);
  }


  viewItemDialog(accountuser_id: number, title: string, component: any) {
    var _popup = this.dialog.open(component, {
      width: '80%',
      data: {
        title: title,
        code: accountuser_id
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.getallUser();
    })
  }


  accountTypeText : string = ''

  accountTypeName : any [] = [
    { value : 1 ,
      text : 'Admin'
    },
    {
      value : 2,
      text : '4ps Staff'
    }
  ];

  getAccountType(account_type: number): string {
    const status = this.accountTypeName.find(
      (option) => option.value === account_type
    );
    return status ? status.text : '';
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.alluserData.filter = filterValue.trim().toLowerCase();
}

  ngOnInit() {
    this.getallUser();
    this.schoolnames = this._schoolname.getSchoolNames()
  }
  openDialog(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef,{
      width: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.createaccountForm.reset();
    });
  }

  get form(): { [key: string]: AbstractControl } {
    // This function will return the form controls
    return this.createaccountForm.controls ;
  }





  adduserSubscription() {
        const formData: accountdetails  = this.createaccountForm.value;
        this._addUserService.adduser(formData).subscribe(
          (response) => {
            console.log('reg success', response);
            this._alertService.simpleAlert(
              'success',
              'Success',
              'Registration successful',
              () => {

              }
            );
            this.createaccountForm.reset();
            this.getallUser();
          },
          (error) => {
            console.log('error', error);
            if (error.status === 401) {
              this._alertService.simpleAlert(
                'error',
                'Error',
                'You already have an account.'
              );
            } else if (error.status === 400) {
              this._alertService.simpleAlert(
                'error',
                'Error',
                'Email already exists.'
              );
            } else {
              this._alertService.simpleAlert(
                'error',
                'Error',
                "Household number doesn't exists on our Database you can't register."
          );
        }
      }
    );
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
  deleteuser(accountuser_id: string) {
    this._alertService.simpleAlert(
      'warning',
      'Warning',
      'Are you sure you want to delete this user?',
      () => {
        this._dataService.deleteuserprofile(accountuser_id).subscribe(
          (result) => {
            if (result && result.status === '200') {
              this.handleSuccess('User profile deleted successfully');

              this.getallUser();
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
        //cancel
        console.log('Action canceled.');
      }
    );
  }
  private handleError(message: string) {
    this._alertService.simpleAlert('error', 'Error', message);
  }
  private handleSuccess(message: string) {
    this._alertService.simpleAlert('success', 'Success', message);
  }
}




