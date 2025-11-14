import { TypeRequest } from "../utils.type";

export type EmployeePaginatedRequest = {
    search: string,
    pageNumber: number,
    pageSize: number,
    sortOrderFirstName: "desc" | "asc",
    sortOrderLastName: "desc" | "asc"
}

export type EmployeeRequest = TypeRequest<"Gosei.EmployeeQualificationManagement.Dtos.Employees.Employee.EmployeeRequest">;