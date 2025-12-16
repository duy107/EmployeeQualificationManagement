import * as z from "zod";

const GenderEnum = z.enum(["Male", "Female"]);

export type EmployeePaginatedRequest = {
    search: string,
    pageNumber: number,
    pageSize: number,
    sortOrderFirstName: "desc" | "asc",
    sortOrderLastName: "desc" | "asc"
}

export const upsertEmployeeSchema = z.object({
    firstName: z.string().trim()
        .min(1, { message: "Required!" })
        .max(10, { message: "Maximum 10 characters" })
        .regex(/^(?=.*[a-zA-Z])[a-zA-Z ]+$/, { message: "Can only contain letters and space" }),
    middleName: z.string().trim()
        .max(10, { message: "Maximum 10 characters" })
        .nullable()
        .optional(),
    lastName: z.string().trim()
        .min(1, { message: "Required!" })
        .max(10, { message: "Maximum 10 characters" })
        .regex(/^(?=.*[a-zA-Z])[a-zA-Z ]+$/, { message: "Can only contain letters and space" }),
    birthDate: z.date({ message: "Invalid!" }),
    gender: GenderEnum
        .nullable(),
    note: z.string().trim()
        .nullable()
        .optional(),
    concurrencyStamp: z.string().trim()
        .min(1, { message: "Required!" })
});

export type UpsertEmployeeType = z.infer<typeof upsertEmployeeSchema>;