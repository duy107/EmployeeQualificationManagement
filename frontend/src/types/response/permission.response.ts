export type PermissionGroupResponse = {
    name: string,
    displayName: string,
    permissions: PermissionNodeResponse[]
}
export type PermissionNodeResponse = {
    name: string,
    displayName: string,
    children: PermissionNodeResponse[]
}