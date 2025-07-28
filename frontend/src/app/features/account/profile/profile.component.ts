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
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapComponent],
  templateUrl: './profile.component.html',
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
    private mapService: MapService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: [''],
    });
  }

  ngOnInit() {
    // Always fetch latest user from backend for location
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

  onDeleteAccount() {
    if (!this.user) return;
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Failed to delete account.');
          console.error(err);
        },
      });
    }
  }
}
