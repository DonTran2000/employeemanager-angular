import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { EmployeeResponse } from '../../responses/employee.response';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginDTO } from '../../dtos/login.dto';
import { TokenService } from '../../services/token.service';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  phone: string = '';
  password: string = '';
  showPassword: boolean = false;

  roles: Role[] = [];
  rememberMe: boolean = false;
  selectedRole: Role | undefined;
  employeeResponse?: EmployeeResponse;

  trackByRoleName(index: number, role: Role): string {
    return role.name;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  checkRemember(): void {
    this.rememberMe = !this.rememberMe;
  }

  onPhoneNumberChanger() {
    console.log(`Phone typed: ${this.phone}`);
  }

  constructor(
    private roleService: RoleService,
    private router: Router,
    private employeeService: EmployeeService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger
        const roles = apiResponse.data;
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
      }
    })
  }

  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }

  resetPassword() {
    debugger
    // Chuyển hướng người dùng đến trang reset mật khẩu
    this.router.navigate(['/resetPassword'])
  }

  login() {
    const message = `phone: ${this.phone}` + `password: ${this.password}`;
    debugger

    const loginDTO: LoginDTO = {
      phone: this.phone,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
    this.employeeService.login(loginDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger;
        const { token, refresh_token } = apiResponse.data;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.tokenService.setRefreshToken(refresh_token)
        } else {
          // Nếu không chọn Remember Me, có thể lưu token vào sessionStorage hoặc chỉ giữ trong biến
          sessionStorage.setItem('access_token', token);
          sessionStorage.setItem('refresh_token', refresh_token);
        }
        debugger;
        this.employeeService.getEmployeeDetails(token).subscribe({
          next: (apiResponse2: ApiResponse) => {
            debugger
            this.employeeResponse = {
              ...apiResponse2.data
            };
            if (this.rememberMe) {
              this.employeeService.saveEmployeeResponseToLocalStorage(this.employeeResponse);
            }
            if (this.employeeResponse?.role.name == 'ADMIN') {
              this.router.navigate(['/admin']);
            } else if (this.employeeResponse?.role.name == 'USER') {
              this.router.navigate(['/']);
            }
          },
          complete: () => {
            debugger;
          },
          error: (error: HttpErrorResponse) => {
            debugger;
            console.error(error?.error?.message ?? '');
          }
        })
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
        alert(error?.error?.message ?? 'Wrong phone number or password');
      }
    })
  }
}

