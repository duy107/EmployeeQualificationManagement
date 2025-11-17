export type LoginRequest = {
    client_id: string,
    scope: string,
    grant_type: string,
    username? : string | null,
    password? : string | null,
    refresh_token? : string | null
}