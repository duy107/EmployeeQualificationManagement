import { get, post } from "@/lib/api.lib";
import { CreateEmployeeQualificationType, EmployeeQualificationPaginatedResponse, EmployeeQualificationResponse, QualificationPaginatedRequest } from "@/types";


const getPaginatedEmployeeQualification = async (data: QualificationPaginatedRequest) => {
    const skipCount = (data.pageNumber - 1) * data.pageSize;
    const query = `EmployeeId=${data.employeeId}&SkipCount=${skipCount}&MaxResultCount=${data.pageSize}&IncludeQualification=true`;
    return await get<EmployeeQualificationPaginatedResponse>(`api/app/employee-qualification?${query}`);
}

const create = async (data: CreateEmployeeQualificationType) =>
    await post<EmployeeQualificationResponse>("api/app/employee-qualification", data);
export { create, getPaginatedEmployeeQualification };

