import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate
} from 'class-validator'

export class ResetPasswordDTO {
    @IsString()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    newPassword: string;

    constructor(data: any) {
        this.email = data.email;
        this.otp = data.otp;
        this.newPassword = data.newPassword;
    }
}