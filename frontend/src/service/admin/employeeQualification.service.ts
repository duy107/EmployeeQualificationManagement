import { get, post } from "@/lib/api.lib";
import { EmployeeQualificationRequest, EmployeeQualificationResponse, QualificationPaginatedRequest, QualificationPaginatedResponse } from "@/types";


const getPaginatedEmployeeQualification = async (data: QualificationPaginatedRequest) => {
    const skipCount = (data.pageNumber - 1) * data.pageSize;
    const query = `EmployeeId=${data.employeeId}&SkipCount=${skipCount}&MaxResultCount=${data.pageSize}&IncludeQualification=true`;
    return await get<QualificationPaginatedResponse>(`api/app/employee-qualification?${query}`);
}

const create = async (data: EmployeeQualificationRequest) =>
    await post<EmployeeQualificationResponse>("api/app/employee-qualification", data);
export { create, getPaginatedEmployeeQualification };

