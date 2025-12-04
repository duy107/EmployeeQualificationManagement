/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

// config
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const publicEndpoint = ["connect/token"];
const apiOpenId = ["connect/token"];

const isPublicEndpoint = (path: string) => publicEndpoint.some(p => path.startsWith(p));

// create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: false,
});

// request
api.interceptors.request.use(async (config) => {
    const path = config.url || "";

    // token
    if (!isPublicEndpoint(path)) {

        let accessToken: string | undefined;

        if (typeof window !== "undefined") {
            const session = await getSession();
            accessToken = (session as any)?.accessToken;
        } else {
            const session = await auth();
            accessToken = (session as any)?.accessToken;
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
    }

    // handle api from openapi
    if (apiOpenId.some(p => p.startsWith(path))) {
        // replace: "Content-Type" : "application/json"
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";

        if (config.data) {
            config.data = new URLSearchParams(config.data as Record<string, string>).toString();
        }
    }

    return config;
})

//response
api.interceptors.response.use(
    (response: AxiosResponse) => {

        if (response.status == 204) {
            response.data = null;
        }
        return response;
    },
    (error) => {

        if (axios.isAxiosError(error) && error.response) {

            const { status, data } = error.response;
            const message = (data as any)?.message || error.message;

            if (status === 401) {
                if (typeof window == "undefined") {
                    signOut({ callbackUrl: "/login" });
                } else {
                    redirect("/login");
                }
                return Promise.reject(new Error("UNAUTHENTICATED"));
            }
            if (status === 403) {
                return Promise.reject(new Error("UNAUTHORIZED"));
            }
            return Promise.reject(new Error(message));
        }
        return Promise.reject(error);
    }
);

// type respose
type ApiResponse<T> = Promise<{ status: number, data: T }>;

// method
const get = async<T>(path: string): ApiResponse<T> => api.get(path);

const post = async<T>(path: string, data?: unknown): ApiResponse<T> => api.post(path, data);

const patch = async <T>(path: string, data?: unknown): ApiResponse<T> => api.patch(path, data);

const put = async <T>(path: string, data?: unknown): ApiResponse<T> => api.put(path, data);

const del = async <T>(path: string): ApiResponse<T> => api.delete(path);

export { del, get, patch, post, put };

