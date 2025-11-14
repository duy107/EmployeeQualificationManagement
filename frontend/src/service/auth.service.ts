import { post } from "@/lib/api.lib";
import { LoginRequest, LoginResponse } from "@/types";

const login = async (data: LoginRequest) => {
    return await post<LoginResponse>("connect/token", data);
}


export { login };
