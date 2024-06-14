import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService, LoggedInUser } from '../api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  invalidLogin = false;
  errorMessage = ''; 
  currentRole = 'user';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      role: ['user', Validators.required],
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.get('role')?.valueChanges.subscribe(role => {
      this.currentRole = role;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const credentials = this.form.value;
    console.log('Submitting credentials:', credentials); // Debug log

    if (credentials.role === 'user') {
      this.apiService.loginUser({ username: credentials.username, password: credentials.password }).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Debug log

          const token = response.token;
          if (typeof token !== 'string') {
            console.error('Invalid token type:', typeof token);
            return;
          }

          localStorage.setItem('access_token', token);
          const decodedTokenSubject = jwtDecode<LoggedInUser>(token);
          console.log('Decoded token:', decodedTokenSubject); // Debug log

          this.router.navigate(['/company-list']);
        },
        error: (err) => {
          console.error('Login Error', err);
          this.invalidLogin = true;
          this.errorMessage = 'Invalid username or password. Please recheck.';
        }
      });
    } else if (credentials.role === 'company') {
      this.apiService.loginCompany({ companyName: credentials.username, password: credentials.password }).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Debug log

          const token = response.token;
          if (typeof token !== 'string') {
            console.error('Invalid token type:', typeof token);
            return;
          }

          localStorage.setItem('access_token', token);
          const decodedTokenSubject = jwtDecode<LoggedInUser>(token);
          console.log('Decoded token:', decodedTokenSubject); // Debug log

          this.router.navigate(['/company-list']);
        },
        error: (err) => {
          console.error('Login Error', err);
          this.invalidLogin = true;
          this.errorMessage = 'Invalid company name or password. Please recheck.';
        }
      });
    }
  }
}
