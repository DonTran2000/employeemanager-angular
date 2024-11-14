import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { ResetPasswordDTO } from "../../dtos/reset.password.dto";
import { ApiResponse } from "../../responses/api.response";
import { EmailService } from "../../services/email.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { EmployeeManagerService } from "../../services/employee.manager.service";
import { OtpCodeDTO } from "../../dtos/otp.code.dto";

@Component({
    selector: 'app-resetpassword',
    templateUrl: './reset.password.component.html',
    styleUrl: './reset.password.component.css',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class ResetPasswordComponent {
    @ViewChild('resetPassForm') resetPassForm!: NgForm;
    @ViewChild('newPasswordForm') newPasswordForm!: NgForm;


    isResetSuccessful: boolean = false;
    otpCodeDTO: OtpCodeDTO = new OtpCodeDTO({});
    resetPasswordDTO: ResetPasswordDTO = new ResetPasswordDTO({});

    isEmailSent: boolean = false;
    confirmPassword: string = '';
    isOtpValidated: boolean = false;

    constructor(
        private emailService: EmailService,
        private toastr: ToastrService,  // Import ToastrService
    ) { }

    resetPassWord() {
        debugger
        if (!this.otpCodeDTO.email) {
            this.toastr.error('Vui lòng nhập địa chỉ email.', 'Lỗi');
            return;
        }

        this.emailService.sendOtp(this.otpCodeDTO).subscribe({
            next: (apiResponse: ApiResponse) => {
                this.isEmailSent = true;
                this.toastr.success('Mã xác nhận đã được gửi. Vui lòng kiểm tra email của bạn.', 'Thành công');
            },
            error: (error: HttpErrorResponse) => {
                this.toastr.error(error?.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại sau.', 'Lỗi');
            }
        });
    }

    confirmResetPassword() {
        if (this.resetPasswordDTO.newPassword !== this.confirmPassword) {
            this.toastr.error('Mật khẩu xác nhận không khớp.', 'Lỗi');
            return;
        }

        this.emailService.resetPassword(this.resetPasswordDTO).subscribe({
            next: (response: ApiResponse) => {
                this.isResetSuccessful = true;
                this.toastr.success('Mật khẩu đã được đặt lại thành công.', 'Thành công');
            },
            error: (error: HttpErrorResponse) => {
                this.toastr.error(error?.error?.message ?? 'Có lỗi xảy ra khi đặt lại mật khẩu.', 'Lỗi');
            }
        });
    }
}