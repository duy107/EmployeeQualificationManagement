import { PaginatedResponse } from "../common"

export type EmployeeQualificationPaginatedResponse = PaginatedResponse<EmployeeQualificationResponse>;

export type EmployeeQualificationResponse = {
    id?: string,
    institution: string,
    city: string | null,
    validFrom: Date | null,
    validTo: Date | null,
    qualificationName: string
}