import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpResponse } from '@angular/common/http';
import { holder } from 'src/app/services/data';

@Component({
  selector: 'app-updateinfo',
  templateUrl: './updateinfo.component.html',
  styleUrls: ['./updateinfo.component.scss']
})
export class UpdateinfoComponent implements OnInit{
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
  fname = (JSON.parse(this.id)).fname;
  lname = (JSON.parse(this.id)).lname;
  assignedName = this.fname + ' ' + this.lname;

  userInfo: any;
  inputdata : any;
  custdata: any;
  fileUrl: string = '';
  selectedFiles?: FileList;
  imagePreview: string | ArrayBuffer | null = null;
  profileForm: FormGroup;
  private subsription_get_all_user: Subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private ref: MatDialogRef<UpdateinfoComponent>,
    private _dataService: DataService,
    private fb: FormBuilder,
    private _alertService: AlertServiceService,
  ){
    this.profileForm = this.fb.group({
      householdid : [''],
      fname : [''],
      mname : [''],
      lname : [''],
      birthdate : [''],
      address : [''],
      maritalstatus : [''],
      mobile_number : [''],
      spoucename: [''],
      spoucebirthdate: [''],
      assigned: [''],
      update_by: [this.assignedName],
      profile_piclink: [''],
    })
  }
  get form(): { [key: string]: AbstractControl } {
    // This function will return the form controls
    return this.profileForm.controls;
  }
  householdid: any;
  ngOnInit(): void {
    this.inputdata = this.data
    this.subsription_get_all_user.add(
      this._dataService.get_holder_profile(this.inputdata.code).subscribe((result) => {
        this.userInfo = result.result[0];
        this.householdid = this.userInfo.householdid
        if (this.userInfo.birthdate) {
          const isoDate = this.userInfo.birthdate;
          const parsedDate = new Date(isoDate);
          const formattedDate = parsedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          // Assign the formatted date to the birthdate property
          this.userInfo.birthdate = formattedDate;
        }

        if (this.userInfo.spoucebirthdate) {
          const isoDateSpouse = this.userInfo.spoucebirthdate;
          const parsedDateSpouse = new Date(isoDateSpouse);
          const formattedDateSpouse = parsedDateSpouse.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          // Assign the formatted date to the spousebirthdate property
          this.userInfo.spoucebirthdate = formattedDateSpouse;
        }
        this.fileUrl = this.userInfo.profile_piclink;

        this.profileForm.patchValue(this.userInfo);
        console.log(this.userInfo);
      })
    );
    console.log(this.userInfo);
  }
  closepopup(){
    this.ref.close();
  }



  selectedFileName!: any;
  profileInfo!: any;

  hide = true;
  isInputDisabled = false;
  subscription: Subscription = new Subscription();
  secActive: boolean = false;
  passwordSuccess: boolean = false;
  infoSuccess: boolean = false;

  onPasswordSubmit() {
    if (this.profileForm.controls['password'] !== this.profileForm.controls['confirmPassword']) {
      this._alertService.simpleAlert(
        'error',
        'Password not match',
        'Password must match'
      );
      return;
    }
    this.passwordSuccess = true;
    this.profileForm.controls['password'].value;
    this.profileForm.controls['confirmPassword'].value;
  }




  
  currentFile?: File;
  progress = 0;
  message = '';

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  clearImagePreview(): void {
    this.imagePreview = null;
  }
  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this._dataService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          },
        });
      }
      this.selectedFiles = undefined;
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const file: File = this.selectedFiles[0];

      // Check the file size
      if (file.size <= 2 * 1024 * 1024) { // 2MB or smaller
        // Check the aspect ratio
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          if (width === height) { // Square (2x2 pixels)
            this.selectedFileName = file.name;
            this.profileForm.get('profile_piclink')?.setValue(this.selectedFileName);

            // Display a preview of the selected image
            this.previewImage(file);
          } else {
            this.handleError('Image must be a square image.')

          }
        };
      } else {
        this.handleError('File size exceeds the maximum allowed size (2MB).');
      }
    }
  }

  update() {
    this._dataService.update_holderinfo(this.profileForm.value).subscribe(
      async (result) => {
        if (result && result.status === '200') {
          this.handleSuccess('4ps Holder Information Updated');
          this.upload()
          this.ref.close();
        } else {
          this.handleError('Failed to Update 4ps Holder Information');
        }
      },
      (error) => {
        this.handleError('Server Error');
        console.error(error);
      }
    );
  }
  private handleSuccess(message: any) {
    this._alertService.simpleAlert('success', 'success', message);
  }

  private handleError(message: any) {
    this._alertService.simpleAlert('error', 'Error', message);
  }
}
