import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { ResetPasswordDTO } from '../dtos/reset.password.dto';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private apiServerUrl = environment.apiBaseUrl;
    private sendResetPasswordApi = `${this.apiServerUrl}/email/send-reset-password`;

    constructor(private http: HttpClient) { }

    sendResetPasswordEmail(resetPasswordDTO: ResetPasswordDTO): Observable<ApiResponse> {
        debugger
        return this.http.post<ApiResponse>(this.sendResetPasswordApi, resetPasswordDTO);
    }
}
