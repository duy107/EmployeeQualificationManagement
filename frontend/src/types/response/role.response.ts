import { TypeResponse } from "../utils.type";

export type RoleResponse = {
    id?: string,
    name: string,
    isPublic: boolean,
    isStatic: boolean,
    grantedPermissions: string[]
}