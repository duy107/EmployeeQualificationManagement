"use client"

import { Button } from "@/components/ui";
import Pagination from "@/components/ui/pagination";
import { getPaginatedEmployeeQualification } from "@/service/admin/employeeQualification.service";
import { EmployeeQualificationResponse, QualificationPaginatedRequest } from "@/types";
import { useEffect, useState } from "react";
import AddQualificationModal from "./addQualification";
import { checkDate, notification } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";


function QualificationForm({ employeeId }: { employeeId: string }) {
    const [open, setOpen] = useState(false);
    const pageSize = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalQualification, setTotalQualification] = useState(0);
    const [qualificationOptions, setQualificationOptions] =
        useState<QualificationPaginatedRequest>({
            pageNumber: currentPage,
            pageSize,
            employeeId
        });
    const {
        data,
        refetch,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["employee-qualification", qualificationOptions],
        queryFn: async () => {
            const res = await getPaginatedEmployeeQualification(qualificationOptions);
            if (res.status !== 200)
                throw new Error(`Failed to fetch list qualification with employeeId: ${employeeId}`);
            return res.data;
        },
        staleTime: 10 * 60 * 1000
    });


    useEffect(() => {
        if (data) {
            setTotalQualification(data?.totalCount || 0);
        }
    }, [data, currentPage]);

    const reload = () => {
        refetch();
    }

    useEffect(() => {
        if (isError && error) {
            notification((error as Error).message);
            setTotalQualification(0);
        }
    }, [isError, error]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        setQualificationOptions((prev) => ({
            ...prev,
            pageNumber: page,
        }))
    };
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

            <div className="border rounded-lg max-h-[480px] overflow-y-auto">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-teal-400 text-white sticky top-0">
                        <tr>
                            <th className="px-3 py-2 text-left">#</th>
                            <th className="px-3 py-2 text-left">Name</th>
                            <th className="px-3 py-2 text-left">Institution</th>
                            <th className="px-3 py-2 text-left">City</th>
                            <th className="px-3 py-2 text-left">Valid From</th>
                            <th className="px-3 py-2 text-left">Valid To</th>
                            <th className="px-3 py-2 text-left">Is Valid?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items?.length || 0 > 0 ? (
                            data?.items?.map((q, index) => {
                                const isValid = checkDate(q.validFrom || "", q.validTo || "");
                                return (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-50 text-gray-700"
                                    >
                                        <td className="px-2 py-1">{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td className="px-2 py-1">{q.qualificationName}</td>
                                        <td className="px-2 py-1">{q.institution}</td>
                                        <td className="px-2 py-1">{q.city}</td>
                                        <td className="px-2 py-1">{q.validFrom || '-'}</td>
                                        <td className="px-2 py-1">{q.validTo || '-'}</td>
                                        <td className="px-2 py-1 text-center">
                                            <span
                                                className={isValid ? "text-green-600" : "text-red-600"}
                                            >
                                                {isValid ? "v" : "x"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-3 text-gray-400"
                                >
                                    No qualifications found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} limitPerPage={pageSize} totalItems={totalQualification} onPageChange={handlePageChange} />
            {employeeId && <AddQualificationModal
                open={open}
                onClose={() => setOpen(false)}
                employeeId={employeeId}
                reload={reload}
            />}
        </div>
    );
}

export default QualificationForm;