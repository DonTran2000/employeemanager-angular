import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDTO } from '../../dtos/register.dto';
import { ApiResponse } from '../../responses/api.response';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EmployeeManagerService } from '../../services/employee.manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  phone: string = '';
  password: string = '';
  retypePassword: string = '';
  name: string = '';
  email: string = '';
  isAccepted: boolean = true;
  showPassword: boolean = false;
  showRetypePassword: boolean = false;
  selectedJobs: string[] = []; // Đảm bảo selectedJobs là mảng
  jobTitles: string[] = ['Java', 'PHP', 'JavaScript', 'Python', 'C++', 'Ruby'];

  constructor(private router: Router, private employeeManagerService: EmployeeManagerService) {
    //inject
  }
  onJobChange(event: any, job: string): void {
    if (event.target.checked) {
      this.selectedJobs.push(job);
    } else {
      const index = this.selectedJobs.indexOf(job);
      if (index > -1) {
        this.selectedJobs.splice(index, 1);
      }
    }
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phone}`)
    //how to validate ? phone must be at least 6 characters
  }
  register() {
    // Ghép các công việc thành chuỗi phân cách bởi dấu phẩy
    const jobTitlesString = this.selectedJobs.join(', ');

    const message = `phone: ${this.phone}` +
      `password: ${this.password}` +
      `retypePassword: ${this.retypePassword}` +
      `name: ${this.name}` +
      `isAccepted: ${this.isAccepted}`;
    //console.error(message);
    debugger

    const registerDTO: RegisterDTO = {
      "name": this.name,
      "email": this.email,
      "phone": this.phone,
      "password": this.password,
      "retype_password": this.retypePassword,
      "job_title": jobTitlesString, // updated from this.jobTitle
      "role_id": 1
    }
    this.employeeManagerService.register(registerDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger
        const confirmation = window.confirm('Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.');
        if (confirmation) {
          this.router.navigate(['/login']);
        }
      },
      complete: () => {
        debugger
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        if (error.status === 409) {
          alert('Email hoặc SĐT đã tồn tại. Vui lòng sử dụng Email hoặc SĐT khác.');
        } else {
          console.error(error?.error?.message ?? '');
        }
      }
    })
  }
  // show for password
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // show for retypePassword
  toggleShowRetypePassword(): void {
    this.showRetypePassword = !this.showRetypePassword;
  }

  //how to check password match ?
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': false });
    }
  }
}