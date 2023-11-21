import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit{
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
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
    private ref: MatDialogRef<InformationComponent>,
    private _dataService: DataService,
    private fb: FormBuilder,
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
      profile_piclink: [''],
    })
  }
  get form(): { [key: string]: AbstractControl } {
    // This function will return the form controls
    return this.profileForm.controls;
  }

 
 
  typeaccount?: number
  ngOnInit(): void {
    this.inputdata = this.data;
    this.subsription_get_all_user.add(
      this._dataService.get_holder_profile(this.inputdata.code).subscribe((result) => {
        this.userInfo = result.result[0];

        // Convert the birthdate to "Month - Date - Year" format
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
      })
    );
  }

  closepopup(){
    this.ref.close();
  }


  previewImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  selectedFileName!: any;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFileName = this.selectedFiles[0].name;
      this.profileForm.get('profile_piclink')?.setValue(this.selectedFileName);
      const file: File = this.selectedFiles[0];

      // Display a preview of the selected image
      this.previewImage(file);
    }
  }

  clearImagePreview(): void {
    this.imagePreview = null;
  }
}
