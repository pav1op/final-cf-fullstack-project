import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService, LoggedInUser, Company } from '../api.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NavbarComponent],
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  companyForm: FormGroup;
  user: LoggedInUser | null = null;
  company: Company | null = null;
  role: string | null = null;
  isEditing = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      surname: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, Validators.required]
    });

    this.companyForm = this.fb.group({
      companyName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, Validators.required],
      addressArea: [{ value: '', disabled: true }],
      addressRoad: [{ value: '', disabled: true }],
      phoneType: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode<{ role: string, username: string }>(token);
      this.role = decodedToken.role;

      if (this.role === 'user') {
        this.apiService.getUserProfile().subscribe({
          next: (response) => {
            this.user = response.data;
            this.userForm.patchValue(this.user);
          },
          error: (err) => console.error(err)
        });
      } else if (this.role === 'company') {
        this.apiService.getCompanyProfile().subscribe({
          next: (response) => {
            this.company = response.data;
            this.companyForm.patchValue({
              companyName: this.company?.companyName || '',
              email: this.company?.email || '',
              addressArea: this.company?.address?.area || '',
              addressRoad: this.company?.address?.road || '',
              phoneType: this.company?.phone?.[0]?.type || '',
              phoneNumber: this.company?.phone?.[0]?.number || ''
            });
          },
          error: (err) => console.error(err)
        });
      }
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.userForm.enable();
      this.userForm.controls['username'].disable();
      this.companyForm.enable();
      this.companyForm.controls['companyName'].disable();
    } else {
      this.userForm.disable();
      this.companyForm.disable();
    }
  }

  saveChanges(): void {
    if (this.role === 'user' && this.userForm.valid) {
      const updatedUser = this.userForm.getRawValue();
      const username = this.user?.username;
      this.apiService.updateUserProfile(username, updatedUser).subscribe({
        next: () => {
          console.log('User profile updated successfully');
          this.toggleEdit();
        },
        error: (err) => console.error('Error updating user profile:', err)
      });
    } else if (this.role === 'company' && this.companyForm.valid) {
      const updatedCompany = {
        ...this.companyForm.getRawValue(),
        address: {
          area: this.companyForm.value.addressArea,
          road: this.companyForm.value.addressRoad
        },
        phone: [{
          type: this.companyForm.value.phoneType,
          number: this.companyForm.value.phoneNumber
        }]
      };
      const companyName = this.company?.companyName;
      this.apiService.updateCompanyProfile(companyName, updatedCompany).subscribe({
        next: () => {
          console.log('Company profile updated successfully');
          this.toggleEdit();
        },
        error: (err) => console.error('Error updating company profile:', err)
      });
    }
  }
}
