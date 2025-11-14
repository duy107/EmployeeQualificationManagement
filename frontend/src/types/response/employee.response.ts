import { TypeResponse } from "../utils.type";

export type EmployeePaginatedResponse = TypeResponse<"/api/app/employee", "get">;
export type EmployeeResponse = TypeResponse<"/api/app/employee/{id}", "get">;