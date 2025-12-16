
"use client";

import React, { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tắt tự động refetch khi focus vào cửa sổ (có thể gây phiền)
            refetchOnWindowFocus: true, 
            // Thử lại 1 lần nếu query lỗi
            retry: 1, 
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children} 
    </QueryClientProvider>
  );
}