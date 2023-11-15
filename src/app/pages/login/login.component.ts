import { Component, OnInit } from '@angular/core';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { accountuser } from 'src/app/services/data';
import { RegisterService } from 'src/app/services/register.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm : FormGroup;
  loginSubscription: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private router : Router,
    private _alertService: AlertServiceService,
    private _registerService: RegisterService,
    private _loginService: LoginService,
    private _sessionService: SessionService
  ){
    this.loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
}
login() {
  this.loginSubscription.add(
    this._loginService
      .login(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .subscribe(
        (result) => {
          if (result['status'] == 200) {
            if (result['results']) {
              const accountType = result['results']['account_type'];

              // Modify account_type based on its value
              let modifiedAccountType: string;

              switch (accountType) {
                case 1:
                  modifiedAccountType = 'Administrator';
                  break;
                case 2:
                  modifiedAccountType = '4ps Staff';
                  break;
                // Add more cases as needed

                default:
                  modifiedAccountType = 'Unknown Role';
                  break;
              }

              this._sessionService.setToken(
                JSON.stringify({
                  accountuser_id: result['results']['accountuser_id'],
                  account_type: result['results']['account_type'],
                  typeAccount: modifiedAccountType,
                  fname: result['results']['fname'],
                  lname: result['results']['lname'],
                  profile_piclink: result['results']['profile_piclink'],
                  authorizationToken: result['results']['authorizationToken'],
                })
              );
              this._alertService.simpleAlert(
                'success',
                'Success',
                'Login Successful'
              );
              this.router.navigate(['/home/dashboard']);
            } else {
              this._alertService.simpleAlert(
                'error',
                'Invalid Account',
                'Invalid Account'
              );
            }
          }
        },
        (error) => {
          console.log(error);
          this._alertService.simpleAlert(
            'error',
            'Error',
            'Invalid Credentials'
          );
        }
      )
  );
}

ngOnDestroy(): void {
  this.loginSubscription.unsubscribe();
  this.loginForm.reset();
}

}
