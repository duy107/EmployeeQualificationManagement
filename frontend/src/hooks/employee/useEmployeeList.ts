"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { getPaginatedEmployee } from "@/service/admin/employee.service";
import { EmployeePaginatedRequest } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export const useEmployeeList = () => {

    const [totalItem, setTotalItem] = useState(0);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const router = useRouter();
    const { status } = useSession();

    const isQueryEnabled = status === "authenticated" && !isLoggingOut;


    const queryClient = useQueryClient();
    const [search, setSearch] = useState<EmployeePaginatedRequest>({
        search: "",
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        sortOrderFirstName: "asc",
        sortOrderLastName: "asc"
    });

    const {
        data,
        isFetching,
        isError,
        error
    } = useQuery({
        queryKey: ["employees", search],
        queryFn: async () => {
            const res = await getPaginatedEmployee(search);
            if (res.status === 200) {
                return res.data;
            }
        },
        enabled: isQueryEnabled,
        staleTime: 2 * 60 * 1000,
        retry: false
    });

    useEffect(() => {
        if (data) {
            const items = data?.items || []
            const total = data?.totalCount || 0;

            if (items.length === 0 && search.pageNumber > 1) {
                setTimeout(() => {
                    setSearch((pre) => ({
                        ...pre,
                        pageNumber: pre.pageNumber - 1
                    }));
                }, 0);
            } else {
                setTimeout(() => setTotalItem(total), 0);
            }
        }
    }, [data, search]);

    useEffect(() => {
        if (isError && error) {
            signOut({ redirect: false }).then(() => {
                router.replace("/login");
            });
        }
    }, [isError, error, router]);

    // const handleHover = (employeeId: string) => {

    //     queryClient.prefetchQuery({
    //         queryKey: ["employee", employeeId],
    //         queryFn: async () => {
    //             const res = await getById(employeeId);
    //             if (res.status === 200) {
    //                 const emp = res.data as EmployeeResponse;
    //                 const cleanedDate = {
    //                     ...emp,
    //                     birthDate: emp.birthDate ? new Date(emp.birthDate) : new Date(1990, 1, 1)
    //                 } as EmployeeResponse;
    //                 return cleanedDate;
    //             }
    //         },
    //         staleTime: 60 * 1000
    //     });
    // };

    const handleSearchSubmit = (searchValue: string) => {
        setSearch((prev) => ({
            ...prev,
            search: searchValue,
            pageNumber: 1,
        }));
    };


    const handlePageChange = (page: number) => {
        setSearch((prev) => ({
            ...prev,
            pageNumber: page,
        }))
    };

    const handleSortOrder = (sortBy: string, sortOrder: string) => {
        setSearch((prev) => ({
            ...prev,
            [sortBy]: sortOrder
        }));
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        queryClient.removeQueries();
        await signOut({ redirect: false });
        router.replace("/login");
    }

    return {
        employees: data?.items || [],
        totalItems: totalItem,
        search,
        isFetching,
        handleSearchSubmit,
        handlePageChange,
        handleSortOrder,
        handleLogout
    }
}