"use client"

import { notification } from "@/lib/utils";
import { getAllByGroup, updatePermission } from "@/service/admin/permission.service";
import { getAll } from "@/service/admin/role.service";
import { PermissionGroupResponse, PermissionNodeResponse, RoleResponse, UpdateBulkRoleType } from "@/types";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const usePermissionList = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const results = useQueries({
        queries: [
            {
                queryKey: ["permission", "all"],
                queryFn: async () => {
                    const res = await getAllByGroup();
                    if (res.status === 200) {
                        return res.data;
                    }
                },
                staleTime: 60 * 1000,
                retry: false
            },
            {
                queryKey: ["role", "all"],
                queryFn: async () => {
                    const res = await getAll();
                    if (res.status === 200) {
                        return res.data;
                    }
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

    const isLoading = results.some(r => r.isLoading);

    useEffect(() => {
        if (roles && roles.length > 0)
            setRoleCheckboxs(roles);
    }, [isReady, roles]);

    useEffect(() => {
        if (hasError) {
            signOut({ redirect: false }).then(() => {
                router.replace("/login");
            });
        }
    }, [hasError, router]);

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
        setRoleCheckboxs(() => {
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

    return {
        hasError,
        isLoading,
        roleCheckboxs,
        permissions,
        handleChange,
        handleToggleCheckox
    }
}