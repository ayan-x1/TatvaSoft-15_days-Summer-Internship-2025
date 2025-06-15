import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { MissionService } from 'src/app/main/services/mission.service';
import { APP_CONFIG } from 'src/app/main/configs/environment.config';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/main/pipes/filter.pipe';
import { Subscription } from 'rxjs';

// Define the interface for the mission application
interface MissionApplicationViewModel {
  id: number;
  missionId: number;
  missionTitle: string;
  missionThemeName: string;
  userId: number;
  userName: string;
  appliedDate: string;
  status: boolean;
  seats: number;
  createdDate: string;
}

@Component({
  selector: 'app-mission-application',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, NgxPaginationModule, CommonModule, FormsModule, FilterPipe],
  templateUrl: './mission-application.component.html',
  styleUrls: ['./mission-application.component.css']
})
export class MissionApplicationComponent implements OnInit, OnDestroy {
  applicationList: MissionApplicationViewModel[] = [];
  searchText: any = "";
  page: number = 1;
  itemsPerPages: number = 5;
  applicationId: any;
  private unsubscribe: Subscription[] = [];

  constructor(
    private _service: MissionService, 
    private _toast: NgToastService, 
    private route: Router
  ) { }

  ngOnInit(): void {
    this.fetchMissionApplicationList();
  }

  getStatus(status: boolean): string {
    return status ? 'Approved' : 'Pending';
  }

  fetchMissionApplicationList() {
    const missionApplicationSubscription = this._service.missionApplicationList().subscribe((data: any) => {
      if (data.result == 1) {
        this.applicationList = data.data;
        console.log('Application List:', this.applicationList); // For debugging
      }
      else {
        this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
      }
    }, err => this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration }));
    this.unsubscribe.push(missionApplicationSubscription);
  }

  approveMissionApplication(value: any) {
    // Add confirmation dialog
    if (!confirm('Are you sure you want to approve this mission application?')) {
      return;
    }

    const missionApplicationSubscription = this._service.missionApplicationApprove(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ detail: "SUCCESS", summary: "Mission application approved successfully", duration: APP_CONFIG.toastDuration });
          // Refresh the list instead of reloading the entire page
          this.fetchMissionApplicationList();
        } else {
          this._toast.error({ detail: "ERROR", summary: data.message, duration: APP_CONFIG.toastDuration });
        }
      },
      (err) => {
        this._toast.error({ detail: "ERROR", summary: err.message, duration: APP_CONFIG.toastDuration });
      }
    );
    this.unsubscribe.push(missionApplicationSubscription);
  }

  deleteMissionApplication(value: any) {
    // Add confirmation dialog
    if (!confirm('Are you sure you want to delete this mission application? This action cannot be undone.')) {
      return;
    }

    // Log the value to see what properties are available
    console.log('Delete application data:', value);
    
    const missionApplicationDeleteSubscription = this._service.missionApplicationDelete(value).subscribe(
      (data: any) => {
        if (data.result == 1) {
          this._toast.success({ 
            detail: "SUCCESS", 
            summary: "Mission application deleted successfully", 
            duration: APP_CONFIG.toastDuration 
          });
          // Refresh the list to show updated data
          this.fetchMissionApplicationList();
        } else {
          this._toast.error({ 
            detail: "ERROR", 
            summary: data.message || "Failed to delete mission application", 
            duration: APP_CONFIG.toastDuration 
          });
        }
      },
      (err) => {
        console.error('Delete error:', err);
        this._toast.error({ 
          detail: "ERROR", 
          summary: err.error?.message || err.message || "An error occurred while deleting", 
          duration: APP_CONFIG.toastDuration 
        });
      }
    );
    this.unsubscribe.push(missionApplicationDeleteSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}