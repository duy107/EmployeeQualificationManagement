import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui";
import { EmployeePaginatedRequest, EmployeeResponse } from "@/types";
import { Loader2, Search } from "lucide-react";
import EmployeeTableRow from "./tableRow";

interface EmployeeTableProps {
    employees: EmployeeResponse[],
    searchParams: EmployeePaginatedRequest,
    isFetching: boolean,
    handleSortOrder: (sortName: string, sortValue: "desc" | "asc") => void,
    prefetchEmployee: (employeeId: string) => void
}

function EmployeeTable({ employees, searchParams, isFetching, handleSortOrder, prefetchEmployee }: EmployeeTableProps) {

    if (isFetching && employees.length === 0) {
        return (
            <div className="py-10 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
            </div>
        );
    }

    if (!isFetching && employees.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Search className="w-12 h-12 text-gray-400" />
                    <p className="text-xl font-medium text-gray-700">No employees found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="max-h-[450px] overflow-y-auto">
                <Table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-1/12">#</TableHead>
                            <TableHead
                                onClick={() => handleSortOrder("sortOrderFirstName", searchParams.sortOrderFirstName === "asc" ? "desc" : "asc")}
                                className="group hover:cursor-pointer transition-all duration-150 text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-200 w-2/12"
                            >
                                <span className="flex items-center gap-2">
                                    First Name
                                    <span className={`text-gray-500 group-hover:text-gray-900 transition-colors ${searchParams.sortOrderFirstName ? 'visible' : 'invisible'}`}>
                                        {searchParams.sortOrderFirstName === "asc" ? "↑" : "↓"}
                                    </span>
                                </span>
                            </TableHead>
                            <TableHead
                                onClick={() => handleSortOrder("sortOrderLastName", searchParams.sortOrderLastName === "asc" ? "desc" : "asc")}
                                className="group hover:cursor-pointer transition-all duration-150 text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-200 w-2/12"
                            >
                                <span className="flex items-center gap-2">
                                    Last Name
                                    <span className={`text-gray-500 group-hover:text-gray-900 transition-colors ${searchParams.sortOrderLastName ? 'visible' : 'invisible'}`}>
                                        {searchParams.sortOrderLastName === "asc" ? "↑" : "↓"}
                                    </span>
                                </span>
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-1/12">Gender</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-1/12">Birth Date</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-3/12">Email</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-2/12">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200">
                        {
                            employees.map((employee, index) => (
                                <EmployeeTableRow
                                    key={index}
                                    employee={employee}
                                    index={index}
                                    pageNumber={searchParams.pageNumber}
                                    pageSize={searchParams.pageSize}
                                    prefetchEmployee={prefetchEmployee}
                                />
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default EmployeeTable;