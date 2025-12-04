import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui";
import { PermissionNodeResponse, RoleResponse } from "@/types";
import { permissionTableRow } from "./tableRow";

interface PermissionTableProps {
    permissions: PermissionNodeResponse[],
    roleCheckboxs: RoleResponse[],
    handleToggleCheckox: (roleId: string, permissionName: string, isChecked: boolean) => void
}

function PermissionTable({ permissions, roleCheckboxs, handleToggleCheckox }: PermissionTableProps) {

    const totalColumns = roleCheckboxs.length + 1;

    return (
        <Table className="w-full text-sm text-left border-collapse">
            <TableHeader>
                <TableRow>
                    <TableHead>Permission</TableHead>
                    {
                        roleCheckboxs.map(item => (
                            <TableHead
                                key={item.id}
                                className="border-b border-gray-200 px-6 py-4 text-center min-w-[120px] whitespace-nowrap"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span>{item.name}</span>
                                </div>
                            </TableHead>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {permissionTableRow(permissions, roleCheckboxs, totalColumns, 0, handleToggleCheckox)}
            </TableBody>
        </Table>
    );
}

export default PermissionTable;