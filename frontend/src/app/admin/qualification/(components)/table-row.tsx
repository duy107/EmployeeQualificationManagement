import { format } from "date-fns";

import { Check, X } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui";

import { checkDate } from "@/lib/utils";
import { EmployeeQualificationResponse } from "@/types";

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
            <TableCell className="px-2 py-1 text-center">{(pageNumber - 1) * pageSize + index + 1}</TableCell>
            <TableCell className="px-2 py-1 text-center">{qualification.qualificationName}</TableCell>
            <TableCell className="px-2 py-1 text-center">{qualification.institution}</TableCell>
            <TableCell className="px-2 py-1 text-center">{qualification.city}</TableCell>
            <TableCell className="px-2 py-1 text-center">{qualification.validFrom ? format(new Date(qualification.validFrom), "dd/MM/yyyy") : "-"}</TableCell>
            <TableCell className="px-2 py-1 text-center">{qualification.validTo ? format(new Date(qualification.validTo), "dd/MM/yyyy") : "-"}</TableCell>
            <TableCell className="px-2 py-1 flex justify-center">
                {isValid ? <Check className="size-5 text-green-500" /> : <X className="size-5 text-red-500" />}
            </TableCell>
        </TableRow>
    );
}

export default QualificationTableRow;