import { PaginatedResponse } from "../common"

export type EmployeePaginatedResponse = PaginatedResponse<EmployeeResponse>;

export type EmployeeResponse = {
    id: string,
    firstName: string,
    middleName?: string | null,
    lastName: string,
    email: string
    gender?: 'Male' | 'Female' | null,
    birthDate: Date,
    note?: string | null,
    concurrencyStamp: string
}