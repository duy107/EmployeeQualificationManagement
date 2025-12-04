import { TableCell, TableRow } from "@/components/ui";
import { checkDate } from "@/lib/utils";
import { EmployeeQualificationResponse } from "@/types";
import { format } from "date-fns";

interface QualificationTableRowProps {
    qualification: EmployeeQualificationResponse,
    pageNumber: number,
    pageSize: number,
    index: number
}

function QualificationTableRow({ qualification, pageNumber, pageSize, index }: QualificationTableRowProps) {

    const isValid = checkDate(qualification.validFrom, qualification.validTo);

    return (
        <TableRow
            className="border-b hover:bg-gray-50 text-gray-700"
        >
            <TableCell className="px-2 py-1">{(pageNumber - 1) * pageSize + index + 1}</TableCell>
            <TableCell className="px-2 py-1">{qualification.qualificationName}</TableCell>
            <TableCell className="px-2 py-1">{qualification.institution}</TableCell>
            <TableCell className="px-2 py-1">{qualification.city}</TableCell>
            <TableCell className="px-2 py-1">{qualification.validFrom ? format(new Date(qualification.validFrom), "dd/MM/yyyy") : "-"}</TableCell>
            <TableCell className="px-2 py-1">{qualification.validTo ? format(new Date(qualification.validTo), "dd/MM/yyyy") : "-"}</TableCell>
            <TableCell className="px-2 py-1 text-center">
                <span
                    className={isValid ? "text-green-600" : "text-red-600"}
                >
                    {isValid ? "v" : "x"}
                </span>
            </TableCell>
        </TableRow>
    );
}

export default QualificationTableRow;