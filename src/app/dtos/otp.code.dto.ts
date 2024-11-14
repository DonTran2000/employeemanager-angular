import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate
} from 'class-validator'

export class OtpCodeDTO {
    @IsPhoneNumber()
    phone: string;

    @IsString()
    email: string;

    @IsString()
    otp: string;

    constructor(data: any) {
        this.phone = data.phone;
        this.email = data.email;
        this.otp = data.otp;
    }
}