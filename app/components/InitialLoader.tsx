"use client";

import { useEffect, useState } from "react";

export const InitialLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chỉ hiển thị loading trong 100ms để tránh flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải ứng dụng...</p>
        </div>
      </div>
    );
  }

  return null;
};
