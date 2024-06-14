import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      role: ['user', Validators.required],
      username: [''],
      name: [''],
      surname: [''],
      companyName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      area: [''],
      road: [''],
      phoneType: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.onRoleChange({ target: { value: 'user' } });
  }

  onRoleChange(event: any): void {
    const role = event.target.value;
    if (role === 'user') {
      this.form.controls['username'].setValidators([Validators.required]);
      this.form.controls['name'].setValidators([Validators.required]);
      this.form.controls['surname'].setValidators([Validators.required]);
      this.form.controls['companyName'].clearValidators();
    } else {
      this.form.controls['companyName'].setValidators([Validators.required]);
      this.form.controls['username'].clearValidators();
      this.form.controls['name'].clearValidators();
      this.form.controls['surname'].clearValidators();
    }
    this.form.controls['username'].updateValueAndValidity();
    this.form.controls['name'].updateValueAndValidity();
    this.form.controls['surname'].updateValueAndValidity();
    this.form.controls['companyName'].updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors);
      return;
    }

    const role = this.form.value.role;
    const formData = this.form.value;

    console.log('Submitting form data:', formData);

    if (role === 'user') {
      this.apiService.registerUser(formData).subscribe({
        next: () => {
          console.log('User registered successfully');
          this.apiService.loginUser({ username: formData.username, password: formData.password }).subscribe({
            next: (response) => {
              localStorage.setItem('access_token', response.token);
              this.apiService.setUserFromToken(response.token); // Set the user in the ApiService
              this.router.navigate(['/company-list']);
            },
            error: (err) => console.error('Error logging in user:', err)
          });
        },
        error: (err) => console.error('Error registering user:', err)
      });
    } else if (role === 'company') {
      const companyData = {
        role: role,
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        address: {
          area: formData.area,
          road: formData.road
        },
        phone: [
          {
            type: formData.phoneType,
            number: formData.phoneNumber
          }
        ]
      };
      console.log('Submitting company data:', companyData);
      this.apiService.registerCompany(companyData).subscribe({
        next: () => {
          console.log('Company registered successfully');
          this.apiService.loginCompany({ companyName: formData.companyName, password: formData.password }).subscribe({
            next: (response) => {
              localStorage.setItem('access_token', response.token);
              this.apiService.setUserFromToken(response.token); 
              this.router.navigate(['/company-list']);
            },
            error: (err) => console.error('Error logging in company:', err)
          });
        },
        error: (err) => console.error('Error registering company:', err)
      });
    }
  }
}
