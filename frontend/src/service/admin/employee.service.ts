import { del, get, post, put } from "@/lib/api.lib";
import { EmployeePaginatedRequest, EmployeePaginatedResponse, EmployeeResponse, UpsertEmployeeType } from "@/types";

const getPaginatedEmployee = async (data: EmployeePaginatedRequest) => {
    const skipCount = (data.pageNumber - 1) * data.pageSize;
    const query = `SearchKey=${data.search}&SkipCount=${skipCount}&MaxResultCount=${data.pageSize}&Sorting=FirstName ${data.sortOrderFirstName},LastName ${data.sortOrderLastName}`;
    const res = await get<EmployeePaginatedResponse>(`api/app/employee?${query}`);
    return res;
}

const getById = async (id: string) =>
 await get<EmployeeResponse>(`api/app/employee/${id}`);

const createEmployee = async (data: UpsertEmployeeType) =>
    await post<EmployeeResponse>("api/app/employee", data);

const updateEmployee = async (id: string, data: UpsertEmployeeType) =>
    await put<EmployeeResponse>(`api/app/employee/${id}`, data);

const deleteEmployee = async (employeeId: string) =>
    await del<unknown>(`api/app/employee/${employeeId}`);

export { createEmployee, deleteEmployee, getById, getPaginatedEmployee, updateEmployee };

