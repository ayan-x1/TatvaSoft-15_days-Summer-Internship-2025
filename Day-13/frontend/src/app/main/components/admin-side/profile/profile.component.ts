import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { AuthService } from 'src/app/main/services/auth.service';
import { ClientService } from 'src/app/main/services/client.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  loginUserDetails: any;
  private unsubscribe: Subscription[] = [];
  loginUserId: any;
  loginDetail: any;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  isUpdating: boolean = false;

  constructor(
    private _loginService: AuthService,
    private _service: ClientService,
    private _toast: NgToastService
  ) {}

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]),
    email: new FormControl({ value: '', disabled: true }),
  });

  ngOnInit(): void {
    this.loginDetail = this._loginService.getUserDetail();
    this.loginUserDetailByUserId(this.loginDetail.userId);
  }

  loginUserDetailByUserId(id: any) {
    const userDetailSubscribe = this._service.loginUserDetailById(id).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this.loginUserDetails = data.data;
          this.populateForm();
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: data.message,
            duration: APP_CONFIG.toastDuration,
          });
        }
      },
      (err) =>
        this._toast.error({
          detail: 'ERROR',
          summary: err.message,
          duration: APP_CONFIG.toastDuration,
        })
    );
    this.unsubscribe.push(userDetailSubscribe);
  }

  populateForm() {
    if (this.loginUserDetails) {
      this.profileForm.patchValue({
        firstName: this.loginUserDetails.firstName || '',
        lastName: this.loginUserDetails.lastName || '',
        phone: this.loginUserDetails.phoneNumber || '',
        email: this.loginUserDetails.emailAddress || ''
      });
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.populateForm();
    } else {
      this.selectedFile = null;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this._toast.error({
          detail: 'ERROR',
          summary: 'Please select a valid image file (JPEG, PNG, or GIF)',
          duration: APP_CONFIG.toastDuration,
        });
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this._toast.error({
          detail: 'ERROR',
          summary: 'File size must be less than 5MB',
          duration: APP_CONFIG.toastDuration,
        });
        return;
      }

      this.selectedFile = file;
    }
  }

  cancelImageSelection() {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }

  uploadImage() {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const uploadSubscribe = this._service.uploadImage(formData).subscribe(
      (response: any) => {
        if (response.result == 1) {
          // Update the user profile with the new image
          this.updateUserProfileImage(response.data);
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: response.message || 'Failed to upload image',
            duration: APP_CONFIG.toastDuration,
          });
          this.isUploading = false;
        }
      },
      (error) => {
        this._toast.error({
          detail: 'ERROR',
          summary: 'Failed to upload image',
          duration: APP_CONFIG.toastDuration,
        });
        this.isUploading = false;
      }
    );
    this.unsubscribe.push(uploadSubscribe);
  }

  updateUserProfileImage(imagePath: string) {
    const updateData = {
      userId: this.loginDetail.userId,
      profileImage: imagePath
    };

    const updateSubscribe = this._service.updateUserProfileImage(updateData).subscribe(
      (response: any) => {
        if (response.result == 1) {
          this.loginUserDetails.profileImage = imagePath;
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';
          this._toast.success({
            detail: 'SUCCESS',
            summary: 'Profile image updated successfully',
            duration: APP_CONFIG.toastDuration,
          });
        } else {
          this._toast.error({
            detail: 'ERROR',
            summary: response.message || 'Failed to update profile image',
            duration: APP_CONFIG.toastDuration,
          });
        }
        this.isUploading = false;
      },
      (error) => {
        this._toast.error({
          detail: 'ERROR',
          summary: 'Failed to update profile image',
          duration: APP_CONFIG.toastDuration,
        });
        this.isUploading = false;
      }
    );
    this.unsubscribe.push(updateSubscribe);
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      
      const formData = new FormData();
      formData.append('userId', this.loginDetail.userId.toString());
      formData.append('firstName', this.profileForm.get('firstName')?.value || '');
      formData.append('lastName', this.profileForm.get('lastName')?.value || '');
      formData.append('phoneNumber', this.profileForm.get('phone')?.value || '');
      formData.append('emailAddress', this.profileForm.get('email')?.value || '');

      const updateSubscribe = this._service.updateUserProfile(formData).subscribe(
        (response: any) => {
          if (response.result == 1) {
            this._toast.success({
              detail: 'SUCCESS',
              summary: 'Profile updated successfully',
              duration: APP_CONFIG.toastDuration,
            });
            this.loginUserDetailByUserId(this.loginDetail.userId);
            this.isEditMode = false;
          } else {
            this._toast.error({
              detail: 'ERROR',
              summary: response.message || 'Failed to update profile',
              duration: APP_CONFIG.toastDuration,
            });
          }
          this.isUpdating = false;
        },
        (error) => {
          this._toast.error({
            detail: 'ERROR',
            summary: 'Failed to update profile',
            duration: APP_CONFIG.toastDuration,
          });
          this.isUpdating = false;
        }
      );
      this.unsubscribe.push(updateSubscribe);
    }
  }

  getFullImageUrl(relativePath: string): string {
    return relativePath ? `${APP_CONFIG.imageBaseUrl}/${relativePath}` : '';
  }

  hasValidProfileImage(): boolean {
    return (
      this.loginUserDetails &&
      this.loginUserDetails.profileImage &&
      this.loginUserDetails.profileImage.trim() !== ''
    );
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}