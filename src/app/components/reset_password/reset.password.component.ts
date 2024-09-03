import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { ResetPasswordDTO } from "../../dtos/reset.password.dto";
import { ApiResponse } from "../../responses/api.response";
import { EmailService } from "../../services/email.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';

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
    phone: string = '';
    email: string = '';

    isResetSuccessful: boolean = false;

    onPhoneNumberChanger() {
        console.log(`Phone typed: ${this.phone}`);
    }

    constructor(
        private emailService: EmailService,
        private router: Router,
        private toastr: ToastrService  // Import ToastrService
    ) { }

    resetPassWord() {
        const resetPasswordDTO: ResetPasswordDTO = {
            phone: this.phone,
            email: this.email
        };

        this.emailService.sendResetPasswordEmail(resetPasswordDTO).subscribe({
            next: (apiResponse: ApiResponse) => {
                debugger;
                this.isResetSuccessful = true; // Ẩn form và hiển thị thông báo
                
                // this.router.navigate(['/login']);
            },
            error: (error: HttpErrorResponse) => {
                debugger;
                this.toastr.error(error?.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại sau.', 'Lỗi');
            }
        })
    }
}