import { ChangeDetectorRef, Component } from '@angular/core';
import { ProfileSettingComponent } from '../profile-setting/profile-setting.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
  fname = (JSON.parse(this.id)).fname;
  lname = (JSON.parse(this.id)).lname;
  profile_piclink = (JSON.parse(this.id)).profile_piclink;
  typeAccount = (JSON.parse(this.id)).typeAccount;



  constructor(
    private dialog: MatDialog,

  ){}


  profilesettings(){
    var _popup = this.dialog.open(ProfileSettingComponent, {
      width: '80%',
    });
    _popup.afterClosed()

  }

}
