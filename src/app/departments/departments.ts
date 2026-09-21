import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService, Department } from '../services/department.service';
import { toFriendlyMessage } from '../utils/http-error.util';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class Departments implements OnInit {

  departments = signal<Department[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  submitting = signal<boolean>(false);
  showForm = signal<boolean>(false);

  name: string = '';
  locationCode: string = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.submitting.set(true);

    this.departmentService.createDepartment({
      name: this.name,
      locationCode: this.locationCode
    }).subscribe({
      next: (newDept) => {
        this.submitting.set(false);
        this.successMessage.set(`${newDept.name} added successfully.`);
        this.departments.update((current) => [...current, newDept]);
        this.name = '';
        this.locationCode = '';
        this.showForm.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(toFriendlyMessage(err));
      }
    });
  }
}
