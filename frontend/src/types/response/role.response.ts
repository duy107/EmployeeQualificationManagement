export type RoleResponse = {
    id?: string,
    name: string,
    isPublic: boolean,
    isStatic: boolean,
    grantedPermissions: string[]
}