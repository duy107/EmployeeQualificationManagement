"use client"

import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { useEmployeeList } from "@/hooks/employee/useEmployeeList";
import Link from "next/link";
import EmployeeSearchBar from "./(components)/searchBar";
import EmployeeTable from "./(components)/table";

function Employees() {
    
    const {
        employees,
        isFetching,
        search,
        totalItems,
        handleHover,
        handlePageChange,
        handleSearchSubmit,
        handleSortOrder,
        handleLogout
    } = useEmployeeList();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Search Bar */}
                <EmployeeSearchBar
                    currentSearch={search.search}
                    onSearchSubmit={handleSearchSubmit}
                    handleLogout={handleLogout}
                />

                {/* add button */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="bg-linear-to-r from-cyan-500 to-cyan-600 text-white px-6 py-4 flex justify-between items-center">
                        <div className="text-2xl">Employee Management</div>
                        <Link href={"/admin/employee/upsert"}>
                            <Button
                                className="hover:cursor-pointer bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                ADD
                            </Button>
                        </Link>
                    </div>

                    {/* table */}
                    <EmployeeTable
                        employees={employees}
                        handleSortOrder={handleSortOrder}
                        isFetching={isFetching}
                        prefetchEmployee={handleHover}
                        searchParams={search}
                    />
                </div>

                {/* pagination */}
                {totalItems > 0 && (
                    <Pagination
                        totalItems={totalItems}
                        limitPerPage={search.pageSize}
                        currentPage={search.pageNumber}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default Employees;