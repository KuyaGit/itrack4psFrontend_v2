import { HttpClient,  HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { BarangaysService } from 'src/app/services/barangays.service';
import { DataService } from 'src/app/services/data.service';
import { SchoolService } from 'src/app/services/school.service';
import { StatusService } from 'src/app/services/status.service';
import { barangayNames, schoolname, statusNames } from 'src/app/services/data';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  schoolnames: schoolname [] = []
  status: statusNames[] = []
  barangay: barangayNames[] = []
  hide = false;
  id: any = localStorage.getItem('user_loginSession')
  account_type = (JSON.parse(this.id)).account_type;
  fname = (JSON.parse(this.id)).fname;
  lname = (JSON.parse(this.id)).lname;
  assignedName = this.fname + ' ' + this.lname;
  previousStatusValue?: string;
  childbeneficiary : FormGroup;
  startDate = new Date(2000, 0, 1);
  fileUrl: string = 'assets/default.png';
  inputdata : string = '';
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
  onUploadFinished: any;
  getStatusType(status: number): string {
    const name = this.statusName.find(
      (option) => option.value === status
    );
    return name ? name.status : '';
  }
  constructor(
    @Inject (MAT_DIALOG_DATA)
    public data: any,
    private http: HttpClient,
    private ref: MatDialogRef<UpdateComponent>,
    private fb : FormBuilder,
    private _schoolname: SchoolService,
    private statuslist: StatusService,
    private _barangay: BarangaysService,
    private _alertService: AlertServiceService,
    private _dataService: DataService,
    private cdr : ChangeDetectorRef,
  ) {
    this.inputdata = this.data.code;
    const currentDate = new Date();
    const updateDate = currentDate.toISOString();
    this.childbeneficiary = this.fb.group({
      child_id: [this.inputdata],
      date_created: [''],
      date_updated: [updateDate],
      schoolname: ['',Validators.required],
      fname: ['',Validators.required],
      lname: ['',Validators.required],
      birthdate: ['',Validators.required],
      snhcourse: ['',Validators.required],
      collegecourse: ['',Validators.required],
      profile_piclink: ['',Validators.required],
      collegeschoolname: ['',Validators.required],
      collegeaddress: ['',Validators.required],
      status: [''],
      elemschool: ['',Validators.required],
      elemaddress: ['',Validators.required],
      junschool: ['',Validators.required],
      junaddress: ['',Validators.required],
      shschoolname: ['',Validators.required],
      scschooladdress: ['',Validators.required],
      tesdacourse: ['',Validators.required],
      work: ['',Validators.required],
      proof: [''],
      updated_by: [this.assignedName],
    })
    this.childbeneficiary.get('junSchool')?.valueChanges.subscribe(() => this.updateSchoolName());
    this.childbeneficiary.get('collegeSchoolName')?.valueChanges.subscribe(() => this.updateSchoolName());
    this.childbeneficiary.get('shSchoolName')?.valueChanges.subscribe(() => this.updateSchoolName());
  }

  updateSchoolName() {
    // Get values from individual controls
    const junSchoolValue = this.childbeneficiary.get('junschool')?.value;
    const collegeSchoolNameValue = this.childbeneficiary.get('collegeschoolname')?.value;
    const shSchoolNameValue = this.childbeneficiary.get('shschoolname')?.value;

    // Check if any of the controls has a value
    if (junSchoolValue || collegeSchoolNameValue || shSchoolNameValue) {
      // Concatenate values and update schoolname control
      const newSchoolName = `${junSchoolValue || ''} ${collegeSchoolNameValue || ''} ${shSchoolNameValue || ''}`.trim();
      this.childbeneficiary.get('schoolname')?.setValue(newSchoolName);
      this.update()
    } else {
      // If none of the controls has a value, set schoolname to an empty string or any default value
      this.update()
      this.childbeneficiary.get('schoolname')?.setValue('');
    }
  }
  isOtherElemSchoolSelected = false;
  onElemSelectChange(event: MatSelectChange): void {
    const selectedValue = event.value;
    // eck if "Other Schools" is selected
    this.isOtherElemSchoolSelected = selectedValue === 'Other';

    // Reset the manual input field if a different option is selected
    this.cdr.detectChanges();
    if (!this.isOtherElemSchoolSelected) {
      this.childbeneficiary.get('otherSchool')?.setValue('');
      this.cdr.detectChanges();
    }
  }
  isOtherJunSchoolSelected = false;
  onJunSelectChange(event: MatSelectChange): void {
    const selectedValue = event.value;
    // eck if "Other Schools" is selected
    this.isOtherJunSchoolSelected = selectedValue === 'Other';

    // Reset the manual input field if a different option is selected
    this.cdr.detectChanges();
    if (!this.isOtherJunSchoolSelected) {
      this.childbeneficiary.get('otherSchool')?.setValue('');
      this.cdr.detectChanges();
    }
    this.cdr.detectChanges();
  }
  isOtherSenSchoolSelected = false;
  onSenSelectChange(event: MatSelectChange): void {
    const selectedValue = event.value;
    // eck if "Other Schools" is selected
    this.isOtherSenSchoolSelected = selectedValue === 'Other';
    // Reset the manual input field if a different option is selected
    this.cdr.detectChanges();
    if (!this.isOtherSenSchoolSelected) {
      this.childbeneficiary.get('otherSchool')?.setValue('');
      this.cdr.detectChanges();
    }
  }
  isOtherColSchoolSelected = false;
  onColSelectChange(event: MatSelectChange): void {

    const selectedValue = event.value;
    // eck if "Other Schools" is selected
    this.isOtherColSchoolSelected = selectedValue === 'Other';
    // Reset the manual input field if a different option is selected
    this.cdr.detectChanges();
    if (!this.isOtherColSchoolSelected) {
      this.childbeneficiary.get('otherSchool')?.setValue('');
      this.cdr.detectChanges();
    }
  }

  checkschoolname() {

  }

  update() {
    this._dataService.update_childbeneficiary(this.childbeneficiary.value).subscribe(
      async (result) => {
        if (result && result.status === '200') {
          this.handleSuccess('Child Beneficiary Status Updated');
          this.upload()
          this.uploadProof()
          this.ref.close();
        } else {
          this.handleError('Failed to Update Child Beneficiary Status');
        }
      },
      (error) => {
        this.handleError('Server Error');
        console.error(error);
      }
    );
  }


  private subsription_get_all_user: Subscription = new Subscription();
  childId: any
  beneStatus: any
  userInfo: any;
  statusValue: any
  ngOnInit() {
    this.schoolnames = this._schoolname.getSchoolNames();
    this.status = this.statuslist.getStatusList();
    this.barangay = this._barangay.getAllBarangayNames();
    this.inputdata = this.data.code
    console.log(this.inputdata)
    this.subsription_get_all_user.add(
      this._dataService.get_child_profile(this.inputdata).subscribe((result) => {
        this.userInfo = result.result[0];
        this.fileUrl = this.userInfo.profile_piclink;
        this.statusValue = this.userInfo.status;
        this.childId = this.userInfo.child_id;
        this.beneStatus = this.userInfo.beneficiary_status;
        this.childbeneficiary.controls['fname'].patchValue(this.userInfo.fname);
        this.childbeneficiary.controls['lname'].patchValue(this.userInfo.lname);
        this.childbeneficiary.controls['profile_piclink'].patchValue(this.userInfo.profile_piclink);
      })
    );
  }

  closepopup(){
    this.ref.close();
  }

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFileName!: any;

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
            this.childbeneficiary.get('profile_piclink')?.setValue(this.selectedFileName);

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
  private handleSuccess(message: any) {
    this._alertService.simpleAlert('success', 'success', message);
  }

  private handleError(message: any) {
    this._alertService.simpleAlert('error', 'Error', message);
  }





  fileName = '';
  currentFileUpload?: File;
  progressbar = 0;
  messages = '';
  selectedFileUpload?: FileList;
  uploadProof(): void {
    this.progress = 0;
    if (this.selectedFileUpload) {
      const file: File | null = this.selectedFileUpload.item(0);
      if (file) {
        this.currentFileUpload = file;
        this._dataService.uploadFile(this.currentFileUpload).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
              this.messages = event.body.message;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progressbar = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFileUpload = undefined;
          },
        });
      }
      this.selectedFileUpload = undefined;
    }
  }

  selectFileUpload(event: any): void {
    this.selectedFileUpload = event.target.files;

    if (this.selectedFileUpload && this.selectedFileUpload.length > 0) {
      const file: File = this.selectedFileUpload[0];

      // Check the file size
      if (file.size <= 2 * 1024 * 1024) { // 2MB or smaller
        // Check the aspect ratio
        const image = new Image();
        image.src = URL.createObjectURL(file);
        this.fileName = file.name;
        this.childbeneficiary.get('proof')?.setValue(this.fileName);
        };
      } else {
        this.handleError('File size exceeds the maximum allowed size (2MB).');
      }
    }
  }


