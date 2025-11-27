import { UpdatePermissionType } from "./permission.request";

export type UpdateBulkRoleType = {
    roles: UpdateRoleType[]
}

export type UpdateRoleType = {
    name: string,
    permissions: UpdatePermissionType[]
}