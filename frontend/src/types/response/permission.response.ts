import { TypeRequest, TypeResponse } from "../utils.type";

export type ListPermissionResponse = TypeResponse<"/api/app/permission/by-group", "get">;

export type PermissionNode = {
    name: string;
    displayName: string;
    children?: PermissionNode[];
}

export type PermissionNodeResponse = TypeRequest<"Gosei.EmployeeQualificationManagement.Dtos.Roles.Permission.PermissionDefinitionResponse">;