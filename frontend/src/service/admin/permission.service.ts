import { get, put } from "@/lib/api.lib";
import { PermissionGroupResponse, UpdateBulkRoleType } from "@/types";

const getAllByGroup = async () =>
    await get<PermissionGroupResponse>("api/app/permission/by-group?culture=en");

const updatePermission = async (data: UpdateBulkRoleType) =>
    await put<any>("api/app/permission", data);
export { getAllByGroup, updatePermission };
