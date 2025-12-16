"use client"

import { JSX } from "react";

import { Input, TableCell, TableRow } from "@/components/ui";

import { PermissionNodeResponse, RoleResponse } from "@/types";

interface PermissionTableRowProps {
    permissions: PermissionNodeResponse[],
    roles: RoleResponse[],
    colSpan: number,
    level: number,
    handleToggleCheckox: (roleId: string, permissionName: string, isChecked: boolean) => void
}

export const PermissionTableRow = (
    { permissions,
        roles,
        colSpan,
        level,
        handleToggleCheckox
    }: PermissionTableRowProps
) => {

    return permissions.flatMap(perm => {
        const hasChildren = Boolean(perm.children && perm.children.length > 0);
        const indentationStyle = {
            paddingLeft: `${16 + level * 20}px`
        };

        const currentRow = (
            <TableRow key={perm.name} className={hasChildren ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-50'}>
                <TableCell
                    className="border border-gray-300 py-2 text-sm whitespace-nowrap"
                    colSpan={1}
                    style={indentationStyle}
                >
                    {hasChildren
                        ? <span className="text-teal-700">{perm.displayName}</span>
                        : <span>{perm.displayName}</span>
                    }
                </TableCell>

                {roles.map(role => {
                    const isChecked = role.grantedPermissions?.includes(perm.name || "") ?? false;
                    if (hasChildren) {
                        return (
                            <TableCell key={`${role.id}-${perm.name}-parent`} className="border border-gray-300 text-center">
                                <Input
                                    type="checkbox"
                                    onClick={(e) => handleToggleCheckox(role.id || "", perm.name || "", e.currentTarget.checked)}
                                    checked={isChecked}
                                    readOnly
                                    className="hover:cursor-default w-4 h-4 text-cyan-600 border-gray-300 rounded"
                                />
                            </TableCell>
                        );
                    } else {
                        return (
                            <TableCell key={`${role.id}-${perm.name}`} className="border border-gray-300 text-center">
                                <Input
                                    onClick={(e) => handleToggleCheckox(role.id || "", perm.name || "", e.currentTarget.checked)}
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="hover:cursor-pointer w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                />
                            </TableCell>
                        );
                    }
                })}
            </TableRow>
        );

        const childrenRows: JSX.Element[] = hasChildren
            ? PermissionTableRow(
                {
                    permissions: perm.children || [],
                    roles: roles,
                    colSpan: colSpan,
                    level: level + 1,
                    handleToggleCheckox: handleToggleCheckox
                }
            )
            : [];

        return [currentRow, ...childrenRows];
    });
}
