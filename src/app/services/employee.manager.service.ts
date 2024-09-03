import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Employee } from "../models/employee";
import { environment } from "../../environments/environment";
import { LoginDTO } from "../dtos/login.dto";
import { RegisterDTO } from "../dtos/register.dto";
import { ApiResponse } from "../responses/api.response";
import { ResetPasswordDTO } from "../dtos/reset.password.dto";

@Injectable({
    providedIn: 'root'
})
export class EmployeeManagerService {
    private apiServerUrl = environment.apiBaseUrl;
    private apiLogin = `${this.apiServerUrl}/employeemanager/login`;
    private apiRegister = `${this.apiServerUrl}/employees/register`;
    private apiResetPassword = `${this.apiServerUrl}/employees/reset-password`;

    private apiConfig = {
        headers: this.createHeaders(),
    }

    constructor(private http: HttpClient) { }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    public register(registerDTO: RegisterDTO): Observable<any> {
        return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
    }

    public login(loginDTO: LoginDTO): Observable<any> {
        return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
    }

    public resetPassword(resetPasswordDTO: ResetPasswordDTO): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.apiResetPassword, resetPasswordDTO, this.apiConfig);
    }

    public getEmployees(): Observable<Employee[]> {
        debugger;
        return this.http.get<Employee[]>(`${this.apiServerUrl}/employeemanager/all`);
    }

    public addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiServerUrl}/employeemanager/add`, employee);
    }

    public updateEmployee(employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiServerUrl}/employeemanager/update`, employee);
    }

    // Vì xoá mềm nên chỉ cần PutMapping
    // active == 1 ? block : unblock
    public deleteEmployee(employeeId: number, active: number): Observable<void> {
        debugger
        return this.http.put<void>(`${this.apiServerUrl}/employeemanager/block/${employeeId}/${active}`, {});
    }
}
