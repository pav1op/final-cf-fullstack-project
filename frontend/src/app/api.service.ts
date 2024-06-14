import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface Credentials {
  username: string;
  password: string;
}

export interface LoggedInUser {
  username: string;
  email: string;
  name: string;
  surname: string;
  role: string;
}

export interface Company {
  companyName: string;
  email: string;
  address: {
    area: string;
    road: string;
  };
  phone: {
    type: string;
    number: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl = 'http://localhost:3000/api'; 
  user = signal<LoggedInUser | null>(null);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loginUser(credentials: { username: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/authenticate`, credentials);
  }

  loginCompany(credentials: { companyName: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/company/authenticate`, credentials);
  }

  registerUser(user: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/register`, user);
  }

  registerCompany(company: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/company/register`, company);
  }

  setUserFromToken(token: string): void {
    if (typeof token === 'string') {
      const decodedToken = jwtDecode<LoggedInUser>(token);
      this.user.set(decodedToken);
    } else {
      console.error('Invalid token: must be a string');
    }
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode<{ username: string }>(token);
      const username = decodedToken.username;
      return this.http.get<any>(`${this.apiUrl}/users/${username}`, {
        headers: this.getAuthHeaders()
      });
    }
    return new Observable(observer => {
      observer.error('No token found');
      observer.complete();
    });
  }

  getCompanyProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode<{ companyName: string }>(token);
      const companyName = decodedToken.companyName;
      return this.http.get<any>(`${this.apiUrl}/company/${companyName}`, {
        headers: this.getAuthHeaders()
      });
    }
    return new Observable(observer => {
      observer.error('No token found');
      observer.complete();
    });
  }

  updateUserProfile(username: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${username}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  updateCompanyProfile(companyName: string, company: Partial<Company>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/company/${companyName}`, company, {
      headers: this.getAuthHeaders()
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.user.set(null);
  }

  searchCompanies(companyName: string): Observable<{ data: Company[] }> {
    return this.http.get<{ data: Company[] }>(`${this.apiUrl}/company?companyName=${companyName}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCompanies(page: number = 1, pageSize: number = 10): Observable<{ data: Company[], totalPages: number, currentPage: number }> {
    return this.http.get<{ data: Company[], totalPages: number, currentPage: number }>(`${this.apiUrl}/company?page=${page}&pageSize=${pageSize}`, {
      headers: this.getAuthHeaders()
    });
  }
}
