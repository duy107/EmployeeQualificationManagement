"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";

import { Search } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { useDebounce } from "@/hooks/use-debounce";

interface EmployeeSearchProps {
    currentSearch: string,
    onSearchSubmit: (searchValue: string) => void,
    handleLogout: () => void
}

function EmployeeSearchBar({ currentSearch, onSearchSubmit, handleLogout }: EmployeeSearchProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { data: session } = useSession();
    const role = session?.user?.role;

    const handleSearch = () => {
        const searchValue = searchInputRef?.current?.value || "";
        onSearchSubmit(searchValue);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleChange = useDebounce(() => {
        handleSearch();
    }, 700);

    return (
        <div className="flex gap-3">
            <div className="relative flex-1">
                <Input
                    type="text"
                    name="search"
                    placeholder="Search for first name, last name..."
                    ref={searchInputRef}
                    defaultValue={currentSearch}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="h-11 pr-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
            <Button
                onClick={handleSearch}
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
            {role == "admin" &&
                <Link href={"/admin/permission"}>
                    <Button
                        variant="outline"
                        className="h-11 px-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium"
                    >
                        Permission
                    </Button>
                </Link>
            }
        </div>
    );
}

export default EmployeeSearchBar;