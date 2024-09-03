import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployeeManagerService } from '../../services/employee.manager.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { EmployeeResponse } from '../../responses/employee.response';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})

export class AdminComponent implements OnInit, OnDestroy {

  remainingTime: number = 0;
  interval: any;

  public employees: Employee[] = [];
  public editEmployee: Employee | null = null;
  public deleteEmployee: Employee | null = null;
  public blockedEmployees: Employee[] = [];

  employeeResponse?: EmployeeResponse | null;
  private employeeManagerService = inject(EmployeeManagerService);
  private employeeService = inject(EmployeeService);
  private tokenService = inject(TokenService);
  private router = inject(Router);


  ngOnInit() {
    this.getEmployees();
    this.updateRemainingTime();
    this.interval = setInterval(() => this.updateRemainingTime(), 1000); // Update every second
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  logOut() {
    this.employeeService.removeEmployeeFromLocalStorage();
    this.tokenService.removeToken();
    this.employeeResponse = this.employeeService.getEmployeeResponseFromLocalStorage();
    this.router.navigate(['/']);
  }

  public getEmployees(): void {
    debugger
    this.employeeManagerService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        debugger
        alert(error.message);
      }
    })
  }

  public onAddEmployee(addForm: NgForm): void {
    const addEmployeeForm = document.getElementById('add-employee-form');
    if (addEmployeeForm) addEmployeeForm.click();
    this.employeeManagerService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeManagerService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number | undefined, active: number): void {
    debugger
    if (employeeId === undefined) return;
    this.employeeManagerService.deleteEmployee(employeeId, active).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    // console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    if (!container) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }

  updateRemainingTime(): void {
    const remainingMilliseconds = this.tokenService.getRemainingTime();
    this.remainingTime = Math.floor(remainingMilliseconds / 1000 / 60); // Convert to minutes
  }

  refreshToken(): void {
    debugger
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      this.tokenService.refreshToken(refreshToken).subscribe(
        response => {
          alert('Token refreshed successfully!');
        },
        error => {
          alert('Failed to refresh token.');
        });
    } else {
      alert('No refresh token available.');
    }
  }
}
