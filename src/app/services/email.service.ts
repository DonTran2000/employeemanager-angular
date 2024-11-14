import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { OtpCodeDTO } from '../dtos/otp.code.dto';
import { ResetPasswordDTO } from '../dtos/reset.password.dto';
@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private apiServerUrl = environment.apiBaseUrl;
    // opt
    private sendOtpApi = `${this.apiServerUrl}/email/otp/send`;
    // validate otp
    private validateOtpApi = `${this.apiServerUrl}/email/otp/validate`;
    // reset password
    private resetPasswordApi = `${this.apiServerUrl}/email/otp/resetPassword`;

    constructor(private http: HttpClient) { }

    sendOtp(otpCodeDTO: OtpCodeDTO): Observable<ApiResponse> {
        debugger
        return this.http.post<ApiResponse>(this.sendOtpApi, otpCodeDTO);
    }

    validateOtp(otpCodeDTO: OtpCodeDTO): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.validateOtpApi, otpCodeDTO);
    }

    resetPassword(resetPasswordDTO: ResetPasswordDTO): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.resetPasswordApi, resetPasswordDTO);
    }
}
