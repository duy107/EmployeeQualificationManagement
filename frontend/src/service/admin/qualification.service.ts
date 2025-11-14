import { get } from "@/lib/api.lib";
import { QualificationResponse, QualificationResponseSchema } from "@/types";

const getAll = async () =>
    await get<any>("api/app/qualification");

export { getAll };