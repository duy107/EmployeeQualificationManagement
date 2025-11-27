import { PaginatedResponse } from "../common"

export type QualificationPaginatedResponse = PaginatedResponse<QualificationResponse>;

export type QualificationResponse = {
    id?: string,
    name: string, 
    code: string
}