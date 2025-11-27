import { get } from "@/lib/api.lib";
import { RoleResponse } from "@/types";

const getAll = async () => 
    await get<RoleResponse[]>("api/app/role/with-permissions");

export { getAll };