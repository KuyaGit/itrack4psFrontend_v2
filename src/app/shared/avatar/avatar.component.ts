import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProfileSettingComponent } from '../user/profile-setting/profile-setting.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
  fname = (JSON.parse(this.id)).fname;
  lname = (JSON.parse(this.id)).lname;
  profile_piclink = (JSON.parse(this.id)).profile_piclink;
  typeAccount = (JSON.parse(this.id)).typeAccount;

  ngOnInit() {
    this.getProfileData();
  }

  constructor(
    private dialog: MatDialog,
    private _dataService: DataService
  ){}
  subscription: Subscription = new Subscription();
  accountuser_id : number = 0;
  profileInfo: any;
  fileUrl : string = ''
  getProfileData() {
    const userSessString = localStorage.getItem('user_loginSession');
    if (userSessString !== null) {
      const parsed = JSON.parse(userSessString);
      this.accountuser_id = parsed.accountuser_id;
      this.subscription.add(
        this._dataService.get_user_profile(this.accountuser_id).subscribe((result) => {
          this.profileInfo = result.result[0];
          this.fileUrl = this.profileInfo.profile_piclink;
        })
      );
    }
  }
  profilesettings(){
    var _popup = this.dialog.open(ProfileSettingComponent, {
      width: '80%',
    });
    _popup.afterClosed().subscribe(item => {
      this.getProfileData()
    })
  }

}
