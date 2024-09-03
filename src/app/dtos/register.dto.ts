import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate
} from 'class-validator';

export class RegisterDTO {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsPhoneNumber()
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    retype_password: string;

    @IsString()
    job_title: string;

    role_id: number = 1;

    constructor(data: any) {
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.job_title = data.job_title;
        this.role_id = data.role_id || 1;
    }
}