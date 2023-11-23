import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { HttpClient,  HttpResponse } from '@angular/common/http';
import { AlertServiceService } from 'src/app/services/alert-service.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  
  achievement!: FormGroup;
  constructor(
    @Inject (MAT_DIALOG_DATA)
    public data: any,
    public formbuilder: FormBuilder,
    private _dataService: DataService,
    private ref: MatDialogRef<CreateComponent>,
    private _alertService: AlertServiceService
  ) {
    this.inputdata = this.data.code;
    this.achievement = this.formbuilder.group({
      child_id: [this.inputdata],
      achievement_name: [''],
      achievement_file: [''],
      achievement_desc: [''],
    })
  }

  inputdata : number = 0;
  ngOnInit(): void {
    this.getchild_id();
  }
  closepopup(){
    this.ref.close();
  }
  getchild_id(){
    this.inputdata = this.data;
    
  }
  addchildachievement() {
    this._dataService.addchildachievement(this.achievement.value).subscribe(
      async (result) => {
        if (result && result.status === '200') {
          this.handleSuccess('Achievement added successfully');
          this.uploadProof()
          this.ref.close()
        } else {
          this.handleError('Failed to add beneficiary information');
          this.achievement.reset();
        }
      },
      (error) => {
        this.handleError('An error occurred while creating beneficiaries profile');
        console.error(error);
      }
    );

  }

  fileName = '';
  currentFileUpload?: File;
  progressbar = 0;
  messages = '';
  selectedFileUpload?: FileList;
  uploadProof(): void {
    this.progressbar = 0;
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
              this.messages = err.error.message;
            } else {
              this.messages = 'Could not upload the file!';
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
        this.achievement.get('achievement_file')?.setValue(this.fileName);
        };
      } else {
        this.handleError('File size exceeds the maximum allowed size (2MB).');
      }
    }






    private handleSuccess(message: any) {
      this._alertService.simpleAlert('success', 'success', message);
    }
  
    private handleError(message: any) {
      this._alertService.simpleAlert('error', 'Error', message);
    }
}
