import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { of, Observable } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { EmployeeResponse } from '../responses/employee.response';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  employeeResponse?: EmployeeResponse | null;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    this.employeeResponse = this.employeeService.getEmployeeResponseFromLocalStorage();
    const isAdmin = this.employeeResponse?.role.name == 'ADMIN';
    debugger
    if (!isTokenExpired && isUserIdValid && isAdmin) {
      return true;
    } else {
      // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
      // Ví dụ trả về trang login:
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  debugger
  return inject(AdminGuard).canActivate(next, state);
}
