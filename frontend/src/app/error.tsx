"use client"

import Link from "next/link";

import { CircleArrowLeft, RefreshCcw, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui";

type ErrorPageType = {
    error: Error & { digest?: string },
    reset: () => void
}

function ErrorPage({ error, reset }: ErrorPageType) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="bg-rose-100 p-3 rounded-full">
                        <TriangleAlertIcon className="size-10 text-red-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-medium text-gray-900">Something went wrong</h2>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <Button
                    onClick={reset}
                    className="font-medium px-6 border-0 bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                >
                    <RefreshCcw className="size-4" />
                    Try agian
                </Button>
                <Button
                    variant={"ghost"}
                    className="font-medium border border-px border-neutral-200 text-neutral-800"
                >
                    <CircleArrowLeft className="size-4" />
                    <Link href={"/"}>Go back</Link>
                </Button>
            </div>
        </div>
    );
}

export default ErrorPage;