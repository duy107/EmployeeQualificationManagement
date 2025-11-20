import { get } from "@/lib/api.lib";

const getAll = async () =>
    await get<any>("api/app/qualification");

export { getAll };