import { auth } from "@/auth";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { notification } from "./utils";

export class HttpError extends Error {
    status: number;
    data: any;

    constructor(status: number, message: string, data: any = null) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.data = data;
    }
}

const publicEndpoint = ["connect/token"];
const apiOpenId = ["connect/token"];

const headers = (api: string): Record<string, string> => {
    const contentType = apiOpenId.some(p => p.startsWith(api))
        ? "application/x-www-form-urlencoded"
        : "application/json";
    return { "Content-Type": contentType };
};

const isPublicEndpoint = (path: string) => publicEndpoint.some(p => path.startsWith(p));

const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (typeof window !== "undefined") {
        const session = await getSession();
        return (session as any)?.accessToken ? { Authorization: `Bearer ${(session as any).accessToken}` } : {};
    }
    const session = await auth();
    return (session as any)?.accessToken
        ? { Authorization: `Bearer ${(session as any).accessToken}` }
        : {};
}

const post = async <T>(path: string, data?: unknown): Promise<{ status: number, data: T }> => {
    const requestHeaders = headers(path);
    const contentType = requestHeaders["Content-Type"];
    let body: BodyInit | null = null;

    if (data) {
        if (contentType === "application/x-www-form-urlencoded") {
            body = new URLSearchParams(data as Record<string, string>).toString();
        } else {
            body = JSON.stringify(data);
        }
    }
    return await fetchAPI(path, {
        method: "POST",
        headers: requestHeaders,
        body
    }) as { status: number, data: T };
}

const get = async <T>(path: string): Promise<{ status: number, data: T }> => {
    return await fetchAPI(path, {
        method: "GET",
    }) as { status: number, data: T };
}

const patch = async<T>(path: string, data?: unknown): Promise<{ status: number, data: T }> => {
    const requestHeaders = headers(path);
    const contentType = requestHeaders["Content-Type"];
    let body: BodyInit | null = null;

    if (data) {
        if (contentType === "application/x-www-form-urlencoded") {
            body = new URLSearchParams(data as Record<string, string>).toString();
        } else {
            body = JSON.stringify(data);
        }
    }
    return await fetchAPI(path, {
        method: "PATCH",
        headers: requestHeaders,
        body
    }) as { status: number, data: T };
}

const put = async<T>(path: string, data?: unknown): Promise<{ status: number, data: T }> => {
    const requestHeaders = headers(path);
    const contentType = requestHeaders["Content-Type"];
    let body: BodyInit | null = null;

    if (data) {
        if (contentType === "application/x-www-form-urlencoded") {
            body = new URLSearchParams(data as Record<string, string>).toString();
        } else {
            body = JSON.stringify(data);
        }
    }
    return await fetchAPI(path, {
        method: "PUT",
        headers: requestHeaders,
        body
    }) as { status: number, data: T };
}
const del = async<T>(path: string): Promise<{ status: number, data: T }> => {
    return await fetchAPI(path, {
        method: "DELETE",
    }) as { status: number, data: T };
}

const fetchAPI = async (path: string, options: RequestInit) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
    if (!isPublicEndpoint(path)) {
        options.headers = {
            ...(options.headers || {}),
            ...(await getAuthHeaders())
        };
    }
    const res = await fetch(fullUrl, options);
    if (res.status === 401) {
        (typeof window !== "undefined") ? signOut({ callbackUrl: "/login" }) : redirect("/login");
    }

    if (res.status === 403) {
        notification("Authorization failed (403)");
        throw new HttpError(403, "Authorization failed (403)");
    }

    if (res.status === 204) {
        return { status: res.status, data: null };
    }

    try {
        return { status: res.status, data: await res.json() }
    } catch (e) {
        return null;
    }
}
export { get, post, patch, del, put };
