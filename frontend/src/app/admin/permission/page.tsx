'use client'

import { Button } from "@/components/ui";
import { notification } from "@/lib/utils";
import { getAllByGroup, updatePermission } from "@/service/admin/permission.service";
import { getAll } from "@/service/admin/role.service";
import { PermissionGroupResponse, PermissionNodeResponse, RoleResponse, UpdateBulkRoleType } from "@/types";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { renderPermissionRows } from "./permissionRow";

function PermissionPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const results = useQueries({
        queries: [
            {
                queryKey: ["permission", "all"],
                queryFn: async () => {
                    const res = await getAllByGroup();
                    if (res.status === 200) return res.data;
                    throw new Error("Fail to fetch list permission");
                },
                staleTime: 60 * 1000,
                retry: false
            },
            {
                queryKey: ["role", "all"],
                queryFn: async () => {
                    const res = await getAll();
                    if (res.status === 200) return res.data;
                    throw new Error("Fail to fetch list role");
                },
                staleTime: 60 * 1000,
                retry: false
            }
        ]
    });
    const isReady = results.every(r => r.isSuccess);

    const hasError = results.some(r => r.isError);

    const permissionGroup = results[0].data as PermissionGroupResponse;
    const permissions = permissionGroup?.permissions as PermissionNodeResponse[];
    const roles = results[1].data as RoleResponse[];
    const [roleCheckboxs, setRoleCheckboxs] = useState<RoleResponse[]>([]);
    useEffect(() => {
        if (roles && roles.length > 0)
            setRoleCheckboxs(roles);
    }, [isReady]);

    useEffect(() => {
        if (hasError) {
            signOut({ redirect: false }).then(() => {
                router.replace("/login");
            });
        }
    }, [hasError, router]);

    if (results.some(r => r.isLoading) || hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-4 h-4 animate-spin" />  Đang tải...
            </div>
        );
    }
    const totalColumns = roles?.length || 0 + 1;

    const handleChange = async () => {
        const data = roles.reduce((initial, current, index) => {
            initial.roles?.push({
                name: current.name,
                permissions: current.grantedPermissions?.map(item => {
                    return {
                        name: item,
                        isGranted: roleCheckboxs[index].grantedPermissions?.includes(item)
                    }
                })
            });
            return initial;
        }, { roles: [] } as UpdateBulkRoleType);

        for (let i = 0; i < roles.length; i++) {
            roleCheckboxs[i].grantedPermissions?.map(item => {
                if (!roles[i].grantedPermissions?.includes(item)) {
                    const findRole = data.roles?.find(item => item.name == roleCheckboxs[i].name);
                    findRole?.permissions?.push({
                        name: item,
                        isGranted: true
                    });
                }
            })
        }
        const res = await updatePermission(data);
        if (res.status === 204) {
            queryClient.invalidateQueries({ queryKey: ["role", "all"] });
            return notification("Permission updated successfully!", "success");
        }
        notification("Error, Try again!");
    }

    const handleToggleCheckox = (roleId: string, permissionName: string, isChecked: boolean) => {
        setRoleCheckboxs(pre => {
            return roleCheckboxs.map(role => {
                const currentGrants = role.grantedPermissions || [];
                let newGrants: string[] = [];
                if (role.id == roleId) {
                    if (isChecked) {
                        newGrants = [...currentGrants, permissionName];
                    } else {
                        newGrants = currentGrants.filter(p => p !== permissionName);
                    }
                } else {
                    newGrants = currentGrants;
                }
                return {
                    ...role,
                    grantedPermissions: newGrants
                };
            });
        })
    };
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
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs">
                            <tr>
                                <th className="sticky left-0 z-20 bg-gray-50 border-b border-gray-200 px-6 py-4 min-w-[300px] shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                                    Permission
                                </th>
                                {
                                    results[1].data?.map(item => (
                                        <th
                                            key={item.id}
                                            className="border-b border-gray-200 px-6 py-4 text-center min-w-[120px] whitespace-nowrap"
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <span>{item.name}</span>
                                                {item.isStatic && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Static</span>}
                                            </div>
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {renderPermissionRows(permissions, roleCheckboxs, totalColumns, 0, handleToggleCheckox)}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default PermissionPage;