import z from "zod";

export type QualificationPaginatedRequest = {
    pageNumber: number,
    pageSize: number,
    employeeId: string
}

export const createEmployeeQualificationSchema = z.object({
    employeeId: z.string(),
    qualificationId: z.string(),
    institution: z.string()
        .min(1, { message: "Required!"}),
    city: z.string().optional(),
    validFrom: z.date().nullable().optional(),
    validTo: z.date().nullable().optional()
})

export type CreateEmployeeQualificationType = z.infer<typeof createEmployeeQualificationSchema>;