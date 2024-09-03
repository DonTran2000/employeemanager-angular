import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate
} from 'class-validator'

export class ResetPasswordDTO {
    @IsPhoneNumber()
    phone: string;

    @IsString()
    email: string;

    constructor(data: any) {
        this.phone = data.phone;
        this.email = data.email;
    }
}