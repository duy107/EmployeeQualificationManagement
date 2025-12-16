"use client"

import { Button } from "@/components/ui";
import Pagination from "@/components/ui/pagination";

import AddQualificationModal from "./add-qualification";
import { useQualificationList } from "@/hooks/qualification/useQualificationList";
import QualificationTable from "@/app/admin/qualification/(components)/table";

function QualificationForm({ employeeId }: { employeeId: string }) {

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
                <AddQualificationModal employeeId={employeeId}>
                    <Button
                        className="bg-teal-400 hover:bg-teal-500 text-white">
                        ADD
                    </Button>
                </AddQualificationModal>
            </div>

            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                <QualificationTable
                    qualifications={qualifications}
                    pageNumber={qualificationOptions.pageNumber}
                    pageSize={qualificationOptions.pageSize}
                />
            </div>

            {/* pagination */}
            <Pagination
                currentPage={qualificationOptions.pageNumber}
                limitPerPage={qualificationOptions.pageSize}
                totalItems={totalQualification}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default QualificationForm;