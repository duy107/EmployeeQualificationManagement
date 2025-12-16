"use client"

import React from "react";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/context/queryClientProvider";

import { roboto } from "@/lib/font.lib";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
                        <Toaster
                            duration={2000}
                            position="bottom-right"
                            richColors
                            closeButton
                        />
                        {children}
                    </SessionProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
