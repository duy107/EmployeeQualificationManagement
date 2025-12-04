import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { EmployeeQualificationResponse } from "@/types";
import QualificationTableRow from "./tableRow";

interface QualificationTableProps {
    qualifications: EmployeeQualificationResponse[],
    pageNumber: number,
    pageSize: number
}

function QualificationTable({ qualifications, pageNumber, pageSize }: QualificationTableProps) {
    return (
        <Table>
            <TableHeader className="bg-teal-400 text-white sticky top-0">
                <TableRow>
                    <TableHead className="px-3 py-2 text-left text-white">#</TableHead>
                    <TableHead className="px-3 py-2 text-left text-white">Name</TableHead>
                    <TableHead className="px-3 py-2 text-left text-white">Institution</TableHead>
                    <TableHead className="px-3 py-2 text-left text-white">City</TableHead>
                    <TableHead className="px-3 py-2 text-left text-white">Valid From</TableHead>
                    <TableHead className="px-3 py-2 text-left text-white">Valid To</TableHead>
                    <TableHead className="px-3 py-2 text-left text-white">Is Valid?</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {qualifications.length || 0 > 0 ? (
                    qualifications.map((q, index) =>
                        <QualificationTableRow
                            key={index}
                            index={index}
                            pageNumber={pageNumber}
                            pageSize={pageSize}
                            qualification={q}
                        />
                    )
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={7}
                            className="text-center py-3 text-gray-400"
                        >
                            No qualifications found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default QualificationTable;