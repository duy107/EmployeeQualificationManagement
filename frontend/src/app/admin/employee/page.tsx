"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { notification } from "@/lib/utils";
import { getPaginatedEmployee } from "@/service/admin/employee.service";
import { EmployeePaginatedRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DeleteEmployee from "./delete";

function Employees() {
    const pageSize = 5;
    const router = useRouter();
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState<EmployeePaginatedRequest>({
        search: "",
        pageNumber: currentPage,
        pageSize: pageSize,
        sortOrderFirstName: "asc",
        sortOrderLastName: "asc"
    });
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["employees", search],
        queryFn: async () => {
            const res = await getPaginatedEmployee(search);
            if (res.status !== 200)
                throw new Error("Failed to fetch employees");
            return res.data;
        },
        staleTime: 2 * 60 * 1000, // cache 2 minutes
    });
    useEffect(() => {
        if (data) {
            const items = data?.items || [];
            const total = data?.totalCount || 0;
            
            if (items.length === 0 && currentPage > 1) {
                const prePage = currentPage - 1;
                setCurrentPage(prePage);
                setSearch((pre) => ({
                    ...pre,
                    pageNumber: prePage
                }));
            } else {
                setTotalItem(total);
            }
        }
    }, [data, currentPage]);
    useEffect(() => {
        if (isError && error) {
            notification((error as Error).message);
            setTotalItem(0);
        }
    }, [isError, error]);

    const handleSearchSubmit = () => {
        const currentSearchInput = searchInputRef.current?.value || "";
        setCurrentPage(1);
        setSearch((prev) => ({
            ...prev,
            search: currentSearchInput,
            pageNumber: 1,
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
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
        router.push("/login");
        await signOut({ redirect: false });
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Search Bar */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            name="search"
                            placeholder="Search for first name, last name..."
                            ref={searchInputRef}
                            defaultValue={search.search}
                            onKeyPress={handleKeyPress}
                            className="h-11 pr-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm"
                        />
                        <button
                            onClick={handleSearchSubmit}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                    <Button
                        onClick={handleSearchSubmit}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 h-11 font-medium shadow-sm"
                    >
                        GO!
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="h-11 px-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium"
                    >
                        Logout
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="bg-linear-to-r from-cyan-500 to-cyan-600 text-white px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold tracking-wide">Employees</h2>
                        <Link href={"/admin/employee/upset"}>
                            <Button
                                className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                ADD
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="max-h-[450px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                                            #
                                        </th>
                                        <th
                                            onClick={() => handleSortOrder("sortOrderFirstName", search.sortOrderFirstName === "asc" ? "desc" : "asc")}
                                            className="group hover:cursor-pointer px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                First Name
                                                <span className="text-gray-400 group-hover:text-gray-600">
                                                    {search.sortOrderFirstName === "asc" ? "↑" : "↓"}
                                                </span>
                                            </span>
                                        </th>
                                        <th
                                            onClick={() => handleSortOrder("sortOrderLastName", search.sortOrderLastName === "asc" ? "desc" : "asc")}
                                            className="group hover:cursor-pointer px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                Last Name
                                                <span className="text-gray-400 group-hover:text-gray-600">
                                                    {search.sortOrderLastName === "asc" ? "↑" : "↓"}
                                                </span>
                                            </span>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Birth Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Email Address
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 w-full overflow-y-auto">
                                    {data?.items?.length || 0 > 0 ? (
                                        data?.items?.map((employee, index) => (
                                            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                    <Link href={`/admin/employee/upset/${employee.id}`}>{employee.firstName}</Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {employee.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {employee.gender}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {employee.birthDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {employee.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <DeleteEmployee employeeId={employee.id} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="w-12 h-12 text-gray-300" />
                                                    <p className="text-lg font-medium">No employees found</p>
                                                    <p className="text-sm">Try adjusting your search criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {totalItem > 0 && (
                    <Pagination
                        totalItems={totalItem}
                        limitPerPage={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default Employees;