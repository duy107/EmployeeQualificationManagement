import { get } from "@/lib/api.lib";
import { QualificationPaginatedResponse } from "@/types";

const getAll = async () =>
    await get<QualificationPaginatedResponse>("api/app/qualification");

export { getAll };