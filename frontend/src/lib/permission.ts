import { getAll } from "@/service/admin/role.service";

const permissionToPathMap: { [key: string]: string } = {
    "EmployeeQualificationManagement.Employees": "/admin/employee",
    "EmployeeQualificationManagement.EmployeeQualifications": "/admin/employee-qualification",
    "EmployeeQualificationManagement.Permissions": "/admin/permission",
    "EmployeeQualificationManagement.Roles": "/admin/role"
}


export const getPermissionToPathMap = async () => {

    const res = await getAll();

    return res.data.map(item => ({
        role: item.name,
        permissions: item.grantedPermissions
            .filter(per => per in permissionToPathMap)
            .map(per => permissionToPathMap[per])
    }))
}