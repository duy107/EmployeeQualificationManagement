"use client"

import QualificationTable from "@/app/admin/qualification/(components)/table";
import { Button } from "@/components/ui";
import Pagination from "@/components/ui/pagination";
import { useQualificationList } from "@/hooks/qualification/useQualificationList";
import { useState } from "react";
import AddQualificationModal from "../(components)/addQualification";

function QualificationForm({ employeeId }: { employeeId: string }) {

    const [open, setOpen] = useState(false);

    const {
        qualifications,
        totalQualification,
        qualificationOptions,
        handlePageChange,
    } = useQualificationList(employeeId);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-teal-600">
                    Qualifications
                </h2>
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-teal-400 hover:bg-teal-500 text-white">
                    ADD
                </Button>
            </div>

            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                <QualificationTable
                    qualifications={qualifications}
                    pageNumber={qualificationOptions.pageNumber}
                    pageSize={qualificationOptions.pageSize}
                />
            </div>

            {/* pagination */}
            <Pagination currentPage={qualificationOptions.pageNumber} limitPerPage={qualificationOptions.pageSize} totalItems={totalQualification} onPageChange={handlePageChange} />

            {/* add qualification */}
            {employeeId && <AddQualificationModal
                open={open}
                onClose={() => setOpen(false)}
                employeeId={employeeId}
            />}
        </div>
    );
}

export default QualificationForm;