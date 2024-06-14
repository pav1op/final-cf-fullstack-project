import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, Company } from '../api.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NavbarComponent],
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  searchForm: FormGroup;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadCompanies(this.currentPage);
  }

  loadCompanies(page: number = 1): void {
    this.apiService.getCompanies(page).subscribe({
      next: (response) => {
        console.log('API response:', response); // Debug log
        this.companies = response.data;
        this.totalPages = +response.totalPages; // Ensure totalPages is a number
        this.currentPage = +response.currentPage; // Ensure currentPage is a number
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Create pages array
        console.log('Loaded companies:', this.companies); // Debug log
      },
      error: (err) => console.error('Error loading companies:', err)
    });
  }

  searchCompanies(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    this.apiService.searchCompanies(searchTerm).subscribe({
      next: (response) => {
        this.companies = response.data;
        this.totalPages = 1; // Reset pagination on search
        this.currentPage = 1;
        this.pages = [1]; // Reset pages array
        console.log('Search results:', this.companies); // Debug log
      },
      error: (err) => console.error('Error searching companies:', err)
    });
  }

  goToPage(page: number): void {
    console.log('Attempting to go to page:', page); // Debug log
    if (page < 1 || page > this.totalPages) {
      console.log('Page out of bounds:', page); // Debug log
      return;
    }
    this.loadCompanies(page);
  }
}
