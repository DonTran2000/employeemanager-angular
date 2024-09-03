export class UpdateEmployeeDTO {
    name: string;
    password: string;
    retype_password: string;

    constructor(data: any) {
        this.name = data.name;
        this.password = data.password;
        this.retype_password = data.retype_password;
    }
}