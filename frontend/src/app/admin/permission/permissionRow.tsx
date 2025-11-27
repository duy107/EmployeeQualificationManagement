"use client"
import { PermissionNodeResponse, RoleResponse } from "@/types";

export const renderPermissionRows = (
    permissions: PermissionNodeResponse[] = [],
    roles: RoleResponse[] = [],
    colSpan: number,
    level: number,
    handleToggleCheckox: (roleId: string, permissionName: string, isChecked: boolean) => void
) => {

    return permissions.flatMap(perm => {
        const hasChildren = Boolean(perm.children && perm.children.length > 0);
        const indentationStyle = {
            paddingLeft: `${16 + level * 20}px`
        };

        const currentRow = (
            <tr key={perm.name} className={hasChildren ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-50'}>
                <td
                    className="border border-gray-300 py-2 text-sm whitespace-nowrap"
                    colSpan={1}
                    style={indentationStyle}
                >
                    {hasChildren
                        ? <span className="text-teal-700">{perm.displayName}</span>
                        : <span>{perm.displayName}</span>
                    }
                </td>

                {roles.map(role => {
                    const isChecked = role.grantedPermissions?.includes(perm.name || "") ?? false;
                    if (hasChildren) {
                        return (
                            <td key={`${role.id}-${perm.name}-parent`} className="border border-gray-300 text-center">
                                <input
                                    type="checkbox"
                                    onClick={(e) => handleToggleCheckox(role.id || "", perm.name || "", e.currentTarget.checked)}
                                    checked={isChecked}
                                    readOnly
                                    className="hover:cursor-default w-4 h-4 text-cyan-600 border-gray-300 rounded"
                                />
                            </td>
                        );
                    } else {
                        return (
                            <td key={`${role.id}-${perm.name}`} className="border border-gray-300 text-center">
                                <input
                                    onClick={(e) => handleToggleCheckox(role.id || "", perm.name || "", e.currentTarget.checked)}
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="hover:cursor-pointer w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                />
                            </td>
                        );
                    }
                })}
            </tr>
        );

        const childrenRows: any = hasChildren
            ? renderPermissionRows(perm.children || [], roles, colSpan, level + 1, handleToggleCheckox)
            : [];
        return [currentRow, ...childrenRows];
    });
}
