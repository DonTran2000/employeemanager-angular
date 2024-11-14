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
    this.roleService.getRoles().subscribe({
      next: (apiResponse: ApiResponse) => {
        const roles = apiResponse.data;
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    })
  }

  createAccount() {
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']);
  }

  resetPassword() {
    // Chuyển hướng người dùng đến trang reset mật khẩu
    this.router.navigate(['/resetPassword'])
  }

  login() {
    // Xóa các lệnh console.log và debugger không cần thiết
    const loginDTO: LoginDTO = {
      phone: this.phone,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };

    this.employeeService.login(loginDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        const { token, refresh_token } = apiResponse.data;
        this.handleTokenStorage(token, refresh_token);
        this.fetchEmployeeDetails(token);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error?.error?.message ?? 'Unknown error');
        alert(error?.error?.message ?? 'Wrong phone number or password');
      }
    });
  }

  private handleTokenStorage(token: string, refreshToken: string): void {
    if (this.rememberMe) {
      this.tokenService.setToken(token);
      this.tokenService.setRefreshToken(refreshToken);
    } else {
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('refresh_token', refreshToken);
    }
  }

  private fetchEmployeeDetails(token: string): void {
    this.employeeService.getEmployeeDetails(token).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.employeeResponse = { ...apiResponse.data };
        if (this.rememberMe) {
          this.employeeService.saveEmployeeResponseToLocalStorage(this.employeeResponse);
        }
        this.navigateBasedOnRole();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching employee details:', error?.error?.message ?? 'Unknown error');
      }
    });
  }

  private navigateBasedOnRole(): void {
    const roleName = this.employeeResponse?.role.name;
    switch (roleName) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'USER':
        this.router.navigate(['/']);
        break;
      default:
        console.log('Unknown role:', roleName);
    }
  }
}

