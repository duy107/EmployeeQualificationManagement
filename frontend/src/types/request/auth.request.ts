import * as z from "zod"

export type LoginRequest = {
    client_id: string,
    scope: string,
    grant_type: string,
    username? : string | null,
    password? : string | null,
    refresh_token? : string | null
}

export const loginFormSchema = z.object({
    username: z.string().min(1, {
        message: "Username or email is required!"
    }),
    password: z.string().min(1, {
        message: "Password is required!"        
    })
});

export type LoginFormType = z.infer<typeof loginFormSchema>;