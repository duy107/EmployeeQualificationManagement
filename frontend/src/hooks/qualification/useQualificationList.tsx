import { getPaginatedEmployeeQualification } from "@/service/admin/employeeQualification.service";
import { QualificationPaginatedRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

export const useQualificationList = ( employeeId: string) => {
    const [totalQualification, setTotalQualification] = useState(0);
    const [qualificationOptions, setQualificationOptions] =
        useState<QualificationPaginatedRequest>({
            pageNumber: 1,
            pageSize: PAGE_SIZE,
            employeeId
        });
    const {
        data,
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
        staleTime: 10 * 60 * 1000,
        retry: false
    });

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                setTotalQualification(data?.totalCount || 0);
            }, 0);
        }
    }, [data]);

    useEffect(() => {
        if (isError && error) {
            setTimeout(() => { setTotalQualification(data?.totalCount || 0) }, 0);
        }
    }, [isError, error, data?.totalCount]);

    const handlePageChange = (page: number) => {
        setQualificationOptions((prev) => ({
            ...prev,
            pageNumber: page,
        }))
    };

    return {
        qualificationOptions,
        qualifications: data?.items || [],
        totalQualification,
        handlePageChange
    }
}