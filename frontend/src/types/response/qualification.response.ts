import { TypeResponse } from "../utils.type";

export type QualificationPaginatedResponse = TypeResponse<"/api/app/employee-qualification", "get">;
export type QualificationResponse = TypeResponse<"/api/app/qualification/{id}", "get">;
export type EmployeeQualificationResponse = TypeResponse<"/api/app/employee-qualification">;