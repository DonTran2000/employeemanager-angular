import { Role } from "../models/role";
export interface EmployeeResponse {
    id: number;
    name: string;
    phone: string;
    is_active: boolean;
    role: Role;
}

