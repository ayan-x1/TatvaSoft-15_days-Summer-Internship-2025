import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { MissionService } from 'src/app/main/services/mission.service';
import { CommonService } from 'src/app/main/services/common.service';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-mission',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './add-mission.component.html',
  styleUrls: ['./add-mission.component.css']
})
export class AddMissionComponent implements OnInit, OnDestroy {
  addMissionForm: FormGroup;
  endDateDisabled: boolean = true;
  regDeadlineDisabled: boolean = true;
  formValid: boolean = false;
  countryList: any[] = [];
  cityList: any[] = [];
  missionThemeList: any[] = [];
  missionSkillList: any[] = [];
  
  // Updated image handling properties
  selectedFiles: File[] = [];
  imageListArray: string[] = [];
  private unsubscribe: Subscription[] = [];

  constructor(
    private _fb: FormBuilder,
    private _service: MissionService,
    private _commonService: CommonService,
    private _router: Router,
    private _toast: NgToastService
  ) { 
    this.addMissionFormValid();
  }

  ngOnInit(): void {
    this.setStartDate();
    this.getCountryList();
    this.getMissionSkillList();
    this.getMissionThemeList();
  }

  addMissionFormValid() {
    this.addMissionForm = this._fb.group({
      countryId: [null, Validators.compose([Validators.required])],
      cityId: [null, Validators.compose([Validators.required])],
      missionTitle: [null, Validators.compose([Validators.required])],
      missionDescription: [null, Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      endDate: [null, Validators.compose([Validators.required])],
      missionThemeId: [null, Validators.compose([Validators.required])],
      missionSkillId: [null, Validators.compose([Validators.required])],
      missionImages: [null, Validators.compose([Validators.required])],
      totalSheets: [null, Validators.compose([Validators.required])]
    });
  }

  // Form control getters
  get countryId() { return this.addMissionForm.get('countryId') as FormControl; }
  get cityId() { return this.addMissionForm.get('cityId') as FormControl; }
  get missionTitle() { return this.addMissionForm.get('missionTitle') as FormControl; }
  get missionDescription() { return this.addMissionForm.get('missionDescription') as FormControl; }
  get startDate() { return this.addMissionForm.get('startDate') as FormControl; }
  get endDate() { return this.addMissionForm.get('endDate') as FormControl; }
  get missionThemeId() { return this.addMissionForm.get('missionThemeId') as FormControl; }
  get missionSkillId() { return this.addMissionForm.get('missionSkillId') as FormControl; }
  get missionImages() { return this.addMissionForm.get('missionImages') as FormControl; }
  get totalSheets() { return this.addMissionForm.get('totalSheets') as FormControl; }

  setStartDate() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    this.addMissionForm.patchValue({
      startDate: todayString
    });
    this.endDateDisabled = false;
    this.regDeadlineDisabled = false;
  }

  getCountryList() {
    const countryListSubscription = this._commonService.countryList().subscribe((data: any) => {
      if (data.result == 1) {
        this.countryList = data.data;
      } else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    });
    this.unsubscribe.push(countryListSubscription);
  }

  getCityList(countryId: any) {
    countryId = countryId.target.value;
    const cityListSubscription = this._commonService.cityList(countryId).subscribe((data: any) => {
      if (data.result == 1) {
        this.cityList = data.data;
      } else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    });
    this.unsubscribe.push(cityListSubscription);
  }

  getMissionSkillList() {
    const getMissionSkillListSubscription = this._service.getMissionSkillList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionSkillList = data.data;
      } else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }));
    this.unsubscribe.push(getMissionSkillListSubscription);
  }

  getMissionThemeList() {
    const getMissionThemeListSubscription = this._service.getMissionThemeList().subscribe((data: any) => {
      if (data.result == 1) {
        this.missionThemeList = data.data;
      } else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }));
    this.unsubscribe.push(getMissionThemeListSubscription);
  }

  // FIXED: Improved image selection with proper validation
  onSelectedImage(event: any) {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    // Check if adding new files exceeds limit
    if (this.selectedFiles.length + files.length > 6) {
      this._toast.error({ 
        detail: "ERROR", 
        summary: "Maximum 6 images can be added.", 
        duration: APP_CONFIG.toastDuration 
      });
      return;
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this._toast.error({ 
          detail: "ERROR", 
          summary: `Invalid file type: ${file.name}. Only JPEG, PNG, and GIF are allowed.`, 
          duration: APP_CONFIG.toastDuration 
        });
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        this._toast.error({ 
          detail: "ERROR", 
          summary: `File ${file.name} is too large. Maximum size is 5MB.`, 
          duration: APP_CONFIG.toastDuration 
        });
        continue;
      }

      // Add file to selected files array
      this.selectedFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageListArray.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Update form control to mark as touched and valid
    this.missionImages.setValue(this.selectedFiles.length > 0 ? 'hasImages' : null);
    this.missionImages.markAsTouched();
  }

  // FIXED: Proper FormData creation for multipart/form-data
  private createFormDataForUpload(): FormData {
    const formData = new FormData();
    
    // Add each file individually
    this.selectedFiles.forEach((file, index) => {
      formData.append('files', file); // Use 'files' as key for multiple files
    });
    
    // Add module name
    formData.append('moduleName', 'Mission');
    
    return formData;
  }

  // FIXED: Improved submit method with proper error handling
  async onSubmit() {
    this.formValid = true;
    
    if (!this.addMissionForm.valid) {
      this._toast.error({ 
        detail: "ERROR", 
        summary: "Please fill all required fields", 
        duration: APP_CONFIG.toastDuration 
      });
      return;
    }

    if (this.selectedFiles.length === 0) {
      this._toast.error({ 
        detail: "ERROR", 
        summary: "Please select at least one image", 
        duration: APP_CONFIG.toastDuration 
      });
      return;
    }

    let imageUrls: string | string[] = [];
    let formValue = { ...this.addMissionForm.value };
    
    // Handle mission skills array
    formValue.missionSkillId = Array.isArray(formValue.missionSkillId) 
      ? formValue.missionSkillId.join(',') 
      : formValue.missionSkillId;

    try {
      // Upload images first
      if (this.selectedFiles.length > 0) {
        const formData = this.createFormDataForUpload();
        
        const uploadResponse = await this._commonService.uploadImage(formData).toPromise();
        
        if (uploadResponse && uploadResponse.success) {
          imageUrls = uploadResponse.data;
        } else {
          throw new Error(uploadResponse?.message || 'Image upload failed');
        }
      }

      // FIXED: Proper handling of imageUrls
      if (Array.isArray(imageUrls)) {
        formValue.missionImages = imageUrls
          .map(url => url.trim())
          .join(",");
      } else if (typeof imageUrls === 'string') {
        formValue.missionImages = imageUrls.trim();
      } else {
        formValue.missionImages = "";
      }

      // Submit mission data
      const addMissionSubscription = this._service.addMission(formValue).subscribe(
        (data: any) => {
          if (data.result == 1) {
            this._toast.success({ 
              detail: "SUCCESS", 
              summary: data.data, 
              duration: APP_CONFIG.toastDuration 
            });
            setTimeout(() => {
              this._router.navigate(['admin/mission']);
            }, 1000);
          } else {
            this._toast.error({ 
              detail: "ERROR", 
              summary: data.message, 
              duration: APP_CONFIG.toastDuration 
            });
          }
        },
        (error) => {
          this._toast.error({ 
            detail: "ERROR", 
            summary: "Failed to create mission", 
            duration: APP_CONFIG.toastDuration 
          });
        }
      );
      
      this.unsubscribe.push(addMissionSubscription);
      
    } catch (error: any) {
      this._toast.error({ 
        detail: "ERROR", 
        summary: error.message || "Upload failed", 
        duration: APP_CONFIG.toastDuration 
      });
    } finally {
      this.formValid = false;
    }
  }

  onCancel() {
    this._router.navigateByUrl('admin/mission');
  }

  // FIXED: Proper image removal with file array cleanup
  onRemoveImages(imageData: string) {
    const index = this.imageListArray.indexOf(imageData);
    
    if (index !== -1) {
      // Remove from preview array
      this.imageListArray.splice(index, 1);
      // Remove from selected files array
      this.selectedFiles.splice(index, 1);
      
      // Update form control
      this.missionImages.setValue(this.selectedFiles.length > 0 ? 'hasImages' : null);
      this.missionImages.markAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}