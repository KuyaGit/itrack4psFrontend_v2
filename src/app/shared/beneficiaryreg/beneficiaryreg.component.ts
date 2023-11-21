import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { barangayNames, holder } from 'src/app/services/data';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { BarangaysService } from 'src/app/services/barangays.service';
import { DataService } from 'src/app/services/data.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-beneficiaryreg',
  templateUrl: './beneficiaryreg.component.html',
  styleUrls: ['./beneficiaryreg.component.scss']
})
export class BeneficiaryregComponent implements OnInit{
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
  fname = (JSON.parse(this.id)).fname;
  lname = (JSON.parse(this.id)).lname;
  barangay: barangayNames[] = []
  assignedName = this.fname + ' ' + this.lname;
  registrationForm!: FormGroup;
  startDate = new Date(2000, 0, 1);
  hide = false;
  constructor(
    private _barangay: BarangaysService,
    private fb : FormBuilder,
    private _registerService: RegisterService,
    private _alertService: AlertServiceService,
    private _dataService : DataService
  ) {
    this.registrationForm = this.fb.group({
        householdid: [''],
        fname: [''],
        mname: [''],
        lname: [''],
        birthdate: [''],
        address: [''],
        maritalstatus: [''],
        mobile_number: [''],
        spoucename: [''],
        spoucebirthdate: [''],
        assigned: [this.assignedName],
        profile_piclink: ['default.png']
    });
  }
  ngOnInit(): void {
    this.getFname()
    this.barangay = this._barangay.getAllBarangayNames();
  }
  getFname() {
    return this.fname
  }
  registerSubscription() {
    console.log('Click add holder')
    this._registerService.addholder(this.registrationForm.value).subscribe(
      (response) => {
        this._alertService.simpleAlert(
          'success',
          'Success',
          response.message,
          () => {
            this.upload();
          }
        );
        this.registrationForm.reset();
      },
      (error) => {
        console.log('error', error);
        if (error.status === 401) {
          this._alertService.simpleAlert(
            'error',
            'Error',
            'You already have an account.'
          );
          this.registrationForm.reset();
        } else if (error.status === 400) {
          this._alertService.simpleAlert(
            'error',
            'Error',
            'Email already exists.'
          );
          this.registrationForm.reset();
        } else {
          this._alertService.simpleAlert(
            'error',
            'Error',
            "Household number doesn't exists on our Database you can't register."
          );
          this.registrationForm.reset();
        }
      }
    );
  }
  fileUrl : string = 'assets/default.png';
  progress = 0;
  selectedFiles?: FileList;
  message = '';
  selectedFileName!: any;
  currentFile?: File;
  imagePreview: string | ArrayBuffer | null = null;
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
            this.registrationForm.get('profile_piclink')?.setValue(this.selectedFileName);

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
  private handleError(message: string) {
    this._alertService.simpleAlert('error', 'Error', message);
  }
  private handleSuccess(message: string) {
    this._alertService.simpleAlert('success', 'Success', message);
  }
}
