import Link from "next/link";
import { format } from "date-fns";

import { Button, TableCell, TableRow } from "@/components/ui";

import { EmployeeResponse } from "@/types";
import DeleteEmployee from "./delete";

interface EmployeeTableRowProps {
    employee: EmployeeResponse,
    index: number,
    pageSize: number,
    pageNumber: number,
    // prefetchEmployee: (employeeId: string) => void
}

function EmployeeTableRow({ employee, index, pageNumber, pageSize }: EmployeeTableRowProps) {
    return (
        <>
            <TableRow
                key={index}
                className="odd:bg-white even:bg-gray-50 hover:bg-cyan-50/50 transition-colors"
            >
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {(pageNumber - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    <Link
                        // onMouseEnter={() => prefetchEmployee(employee.id || "")}
                        href={`/admin/employee/upsert/${employee.id}`}
                        className="text-cyan-600 hover:text-cyan-800 hover:cursor-pointer font-medium transition-colors"
                    >
                        {employee.firstName}
                    </Link>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{employee.lastName}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{employee.gender}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{format(employee.birthDate, "dd/MM/yyyy")}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-800 truncate max-w-xs">{employee.email}</TableCell>
                <TableCell >
                    <DeleteEmployee employeeId={employee.id}>
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer text-red-500 border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-red-400 text-xs px-3 py-1.5 font-medium transition-all"
                        >
                            DELETE
                        </Button>
                    </DeleteEmployee>
                </TableCell>
            </TableRow>
        </>
    );
}

export default EmployeeTableRow;