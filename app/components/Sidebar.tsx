"use client";

import { useState } from "react";
import Link from "next/link";

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  activeMenu: string;
  activeSubmenu?: string;
}

const subMenus: Record<string, SubMenuItem[]> = {
  dashboard: [
    { id: "overview", label: "Tổng quan", href: "/dashboard/overview" },
    { id: "analytics", label: "Phân tích", href: "/dashboard/analytics" },
    { id: "reports", label: "Báo cáo", href: "/dashboard/reports" },
  ],
  "craw-data": [
    { id: "new-task", label: "Tác vụ mới", href: "/craw-data" },
    { id: "history", label: "Lịch sử craw", href: "/craw-data/history" },
    { id: "settings", label: "Cài đặt craw", href: "/craw-data/settings" },
  ],
  post: [
    { id: "create", label: "Tạo bài đăng", href: "/post" },
    { id: "drafts", label: "Bản nháp", href: "/post/drafts" },
    { id: "scheduled", label: "Đã lên lịch", href: "/post/scheduled" },
    { id: "published", label: "Đã đăng", href: "/post/published" },
  ],
  reports: [
    { id: "sales", label: "Báo cáo bán hàng", href: "/reports/sales" },
    { id: "revenue", label: "Báo cáo doanh thu", href: "/reports/revenue" },
    { id: "products", label: "Báo cáo sản phẩm", href: "/reports/products" },
    {
      id: "customers",
      label: "Báo cáo khách hàng",
      href: "/reports/customers",
    },
  ],
  settings: [
    { id: "general", label: "Cài đặt chung", href: "/settings/general" },
    { id: "users", label: "Quản lý người dùng", href: "/settings/users" },
    { id: "permissions", label: "Phân quyền", href: "/settings/permissions" },
  ],
};

const menuLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "craw-data": "Craw Data",
  post: "Đăng bài",
  reports: "Báo cáo",
  settings: "Cài đặt",
};

export default function Sidebar({ activeMenu, activeSubmenu }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentSubMenu = subMenus[activeMenu] || [];

  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 h-screen ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              {menuLabels[activeMenu]}
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {currentSubMenu.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isCollapsed ? "justify-center" : "justify-start"
              } ${
                activeSubmenu === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {item.icon && (
                <span className="mr-3 text-gray-500">{item.icon}</span>
              )}
              {!isCollapsed && item.label}
              {isCollapsed && item.icon && (
                <span className="text-gray-500" title={item.label}>
                  {item.icon}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">Farm FB v1.0.0</div>
          </div>
        )}
      </div>
    </aside>
  );
}
