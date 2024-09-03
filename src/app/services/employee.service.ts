import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { LoginDTO } from "../dtos/login.dto";
import { ApiResponse } from "../responses/api.response";
import { EmployeeResponse } from "../responses/employee.response";
import { UpdateEmployeeDTO } from "../dtos/update.employee.dto";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiServerUrl = environment.apiBaseUrl;
    private apiLogin = `${this.apiServerUrl}/employees/login`;
    private apiEmployeeDetail = `${this.apiServerUrl}/employees/details`;

    localStorage?: Storage;

    private apiConfig = {
        headers: this.createHeaders(),
    }

    constructor(private http: HttpClient) {
        this.localStorage = document.defaultView?.localStorage;
    }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    private createHeadersWithAuthor(token: string): HttpHeaders {
        return new HttpHeaders({ 
            'Content-Type': 'application/json' ,
            Authorization: `Bearer ${token}`
        })
    }

    public login(loginDTO: LoginDTO): Observable<any> {
        return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
    }

    public getEmployeeDetails(token: string): Observable<ApiResponse> {
        debugger
        const headers = this.createHeadersWithAuthor(token);
        return this.http.post<ApiResponse>(this.apiEmployeeDetail, { headers });
    }

    public saveEmployeeResponseToLocalStorage(employeeResponse?: EmployeeResponse) {
        try {
            debugger
            if (employeeResponse == null || !employeeResponse) {
                return;
            }
            // Convert the employeeResponse object to a JSON string
            const employeeResponseJSON = JSON.stringify(employeeResponse);
            // Save the JSON string to local storage with a key (e.g., "userResponse")
            this.localStorage?.setItem('employee', employeeResponseJSON);
            console.log('Employee response saved to local storage.');
        } catch (error) {
            console.error('Error saving employee response to local storage:', error);
        }
    }

    public getEmployeeResponseFromLocalStorage(): EmployeeResponse | null {
        try {
            // Retrieve the JSON string from local storage using the key
            const employeeResponseJSON = this.localStorage?.getItem('employee');
            if (employeeResponseJSON == null || employeeResponseJSON == undefined) {
                return null;
            }
            // Parse the JSON string back to an object
            const employeeResponse = JSON.parse(employeeResponseJSON!);
            console.log('Employee response retrieved form local storage.');
            return employeeResponse;
        } catch (error) {
            console.error('Error retrieving employee response from local storage:', error);
            return null; // Return null or handle the error as needed
        }
    }

    public removeEmployeeFromLocalStorage(): void {
        try {
            // Remove the user data from local storage using the key
            this.localStorage?.removeItem('employee');
        } catch (error) {
            console.error('Error removing employee data from local storage:', error);
            // Handle the error as needed
        }
    }
}