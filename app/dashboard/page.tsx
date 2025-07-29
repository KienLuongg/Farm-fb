"use client";

import { useAuth } from "../../redux/hooks/useAuth";
import Layout from "../components/Layout";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Kiểm tra localStorage trực tiếp
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const localUser = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = token && localUser;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Tổng quan hoạt động của hệ thống quản lý nông trại
          </p>
        </div>

        {isLoggedIn ? (
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-green-800 mb-2">
                Chào mừng trở lại!
              </h2>
              <p className="text-green-700">
                Bạn đã đăng nhập thành công với tài khoản:{" "}
                <strong>{localUser.full_name}</strong>
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Tổng doanh thu
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      12,500,000 VNĐ
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Tổng đơn hàng
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      1,247
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Khách hàng
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">892</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Sản phẩm
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">156</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-800 mb-3">
                  Thông tin tài khoản
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Username:</span>{" "}
                    {localUser.username}
                  </p>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Email:</span>{" "}
                    {localUser.email}
                  </p>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Role:</span>{" "}
                    {localUser.is_admin ? "Admin" : "User"}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-medium text-yellow-800 mb-3">Trạng thái</h3>
                <div className="space-y-2">
                  <p className="text-sm text-yellow-700">
                    {localUser.is_active
                      ? "Tài khoản đang hoạt động"
                      : "Tài khoản đã bị khóa"}
                  </p>
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Ngày tạo:</span>{" "}
                    {new Date(localUser.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-medium text-green-800 mb-3">
                  Hành động nhanh
                </h3>
                <div className="space-y-2">
                  <button className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                    Tạo đơn hàng mới
                  </button>
                  <button className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                    Xem báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">
              Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
