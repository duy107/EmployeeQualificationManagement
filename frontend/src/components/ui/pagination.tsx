"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalItems: number;
  limitPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalItems,
  limitPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / limitPerPage);
  if (totalPages <= 1) return null;
  
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pageNumbers.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 2 && page <= currentPage + 2)
  );

  return (
    <div className="flex justify-center items-center gap-2 mt-6 select-none">
      
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Trước
      </Button>

      {visiblePages.map((page, i) => (
        <div key={page} className="flex items-center">
    
          {i > 0 && visiblePages[i - 1] !== page - 1 && (
            <span className="px-1 text-muted-foreground">...</span>
          )}
          <Button
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all duration-150",
              currentPage === page &&
                "bg-primary text-white shadow-md scale-105 hover:bg-primary/90"
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        </div>
      ))}

     
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Sau
      </Button>
    </div>
  );
}
