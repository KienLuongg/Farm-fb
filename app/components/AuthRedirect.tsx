"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication ngay lập tức khi component mount
    if (typeof window === "undefined") {
      setIsChecking(false);
      return;
    }

    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");

      // Nếu không có token hoặc user và không ở trang login -> redirect to login
      if ((!token || !user) && pathname !== "/login") {
        router.replace("/login");
        return;
      }

      // Nếu có token và user và đang ở trang login -> redirect to dashboard
      if (token && user && pathname === "/login") {
        router.replace("/dashboard");
        return;
      }

      // Nếu có token và user và đang ở trang root -> redirect to dashboard
      if (token && user && pathname === "/") {
        router.replace("/dashboard");
        return;
      }

      setIsChecking(false);
    };

    // Check ngay lập tức, không chờ Redux
    // Sử dụng setTimeout để đảm bảo router đã sẵn sàng
    setTimeout(checkAuth, 0);
  }, [pathname, router]);

  // Loading screen khi đang check auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return null;
};
