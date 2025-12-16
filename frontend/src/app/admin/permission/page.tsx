"use client"

import Link from "next/link";

import { Save } from "lucide-react";

import { Button } from "@/components/ui";
import PermissionTable from "./(components)/table";
import FullscreenLoader from "@/components/fullscreen-loader";

import { usePermissionList } from "@/hooks/permission/usePermissionList";

function PermissionPage() {

    const {
        hasError,
        isLoading,
        roleCheckboxs,
        permissions,
        handleChange,
        handleToggleCheckox
    } = usePermissionList();

    if (isLoading || hasError) {
        return <FullscreenLoader />
    }

    return (
        <div className="container mx-auto max-w-7xl p-6 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="hover:cursor-pointer">
                        <Link href={"/admin/employee"}>Cancel</Link>
                    </Button>
                    <Button
                        onClick={() => handleChange()}
                        className="flex items-center gap-2 hover:cursor-pointer">
                        <Save className="w-4 h-4" />
                        Save
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <PermissionTable
                        permissions={permissions}
                        handleToggleCheckox={handleToggleCheckox}
                        roleCheckboxs={roleCheckboxs}
                    />
                </div>
            </div>

        </div>
    );
}

export default PermissionPage;