import { get, put } from "@/lib/api.lib";
import { BulkRoleUpdateRequest } from "@/types";
import { ListPermissionResponse } from "@/types/response/permission.response";

const getAllByGroup = async () =>
    await get<ListPermissionResponse>("api/app/permission/by-group?culture=en");

const updatePermission = async (data: BulkRoleUpdateRequest) =>
    await put<any>("api/app/permission", data);
export { getAllByGroup, updatePermission };