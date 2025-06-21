import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';
import { MapComponent } from '../../../shared/components/map/map.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapComponent],
  template: `
    <div class="profile-container">
      <h2>Profile Information</h2>
      <form
        [formGroup]="profileForm"
        (ngSubmit)="onSubmit()"
        class="profile-form"
      >
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            formControlName="username"
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Enter your email"
            readonly
          />
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <ng-container *ngIf="locationChecked">
            <ng-container
              *ngIf="
                user && user.latitude != null && user.longitude != null;
                else noLocation
              "
            >
              <div class="profile-map-box">
                <app-map
                  [latitude]="user.latitude"
                  [longitude]="user.longitude"
                ></app-map>
              </div>
              <div
                style="font-size: 0.95em; color: #555; margin-bottom: 0.5rem;"
              >
                Lat: {{ user.latitude }}, Lng: {{ user.longitude }}
              </div>
              <button
                type="button"
                class="btn-set-location"
                (click)="updateLocation()"
                [disabled]="updatingLocation"
              >
                <span *ngIf="!updatingLocation"
                  ><i class="fas fa-sync-alt"></i> Update Location</span
                >
                <span *ngIf="updatingLocation"
                  ><i class="fas fa-spinner fa-spin"></i> Updating...</span
                >
              </button>
            </ng-container>
            <ng-template #noLocation>
              <button
                type="button"
                class="btn-set-location"
                (click)="setLocation()"
                [disabled]="loadingLocation"
              >
                <span *ngIf="!loadingLocation"
                  ><i class="fas fa-map-marker-alt"></i> Set My Location</span
                >
                <span *ngIf="loadingLocation"
                  ><i class="fas fa-spinner fa-spin"></i> Setting...</span
                >
              </button>
            </ng-template>
          </ng-container>
        </div>
        <button type="submit" class="btn-save" [disabled]="profileForm.invalid">
          Save Changes
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loadingLocation = false;
  user: User | null = null;
  locationChecked = false;
  updatingLocation = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private mapService: MapService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: [''],
    });
  }

  ngOnInit() {
    // Always fetch latest user from backend for location
    const creds = this.authService.getCredentials();
    if (creds) {
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          this.profileForm.patchValue({
            username: user.username,
            email: user.email,
            location:
              user.latitude != null && user.longitude != null
                ? `${user.latitude}, ${user.longitude}`
                : '',
          });
          this.locationChecked = true;
        },
        error: () => {
          this.locationChecked = true;
        },
      });
    } else {
      this.locationChecked = true;
    }
  }

  updateLocation(): void {
    if (!this.user) return;
    this.updatingLocation = true;

    new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
      .then((position) => {
        const { latitude, longitude } = position.coords;
        this.userService
          .updateCurrentUserLocation({ latitude, longitude })
          .subscribe({
            next: () => {
              if (this.user) {
                this.user.latitude = latitude;
                this.user.longitude = longitude;
              }
              this.updatingLocation = false;
            },
            error: () => {
              this.updatingLocation = false;
              // You could add some user-facing error feedback here
            },
          });
      })
      .catch((error) => {
        this.updatingLocation = false;
        // Handle error getting location
      });
  }

  async setLocation() {
    if (!this.user) return;
    this.loadingLocation = true;
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      this.userService
        .updateCurrentUserLocation({ latitude, longitude })
        .subscribe({
          next: () => {
            if (this.user) {
              this.user.latitude = latitude;
              this.user.longitude = longitude;
              this.profileForm.patchValue({
                location: `${latitude}, ${longitude}`,
              });
            }
            this.loadingLocation = false;
          },
          error: (err) => {
            console.error('Failed to save location', err);
            alert('Failed to save location');
            this.loadingLocation = false;
          },
        });
    } catch (e) {
      alert('Failed to get location');
      this.loadingLocation = false;
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.user) {
      const updatedUser: Partial<User> = {
        displayName: this.profileForm.value.username,
      };

      this.userService.updateUser(this.user.id, updatedUser as User).subscribe({
        next: (user) => {
          this.user = user;
          this.authService.updateCurrentUser(user);
          alert('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Failed to update profile', err);
          alert('Failed to update profile');
        },
      });
    }
  }
}
