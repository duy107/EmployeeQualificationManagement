import { TypeRequest } from "../utils.type";


export type QualificationPaginatedRequest = {
    pageNumber: number,
    pageSize: number,
    employeeId: string
}

export type EmployeeQualificationRequest = TypeRequest<"Gosei.EmployeeQualificationManagement.Dtos.Employees.Qualification.EmployeeQualificationRequest">;    