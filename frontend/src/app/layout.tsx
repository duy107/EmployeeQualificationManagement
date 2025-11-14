'use client";'
import { roboto } from "@/lib/font.lib";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "@/context/queryClientProvider";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${roboto.className} antialiased`}
            >
                <QueryProvider>
                    <SessionProvider>
                        <ToastContainer position="top-right" autoClose={3000} />
                        {children}
                    </SessionProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
