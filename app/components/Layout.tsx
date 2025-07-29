"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../redux/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [activeSubmenu, setActiveSubmenu] = useState("");
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();

  // Update active menu and submenu based on current pathname
  useEffect(() => {
    const path = pathname.split("/")[1]; // Get the first segment of the path
    const subPath = pathname.split("/")[2]; // Get the second segment of the path

    if (path === "dashboard") {
      setActiveMenu("dashboard");
      setActiveSubmenu(subPath || "overview");
    } else if (path === "craw-data") {
      setActiveMenu("craw-data");
      setActiveSubmenu(subPath || "target-pages");
    } else if (path === "posts") {
      setActiveMenu("craw-data");
      setActiveSubmenu("posts");
    } else if (path === "users") {
      setActiveMenu("craw-data");
      setActiveSubmenu("users");
    } else if (path === "comments") {
      setActiveMenu("craw-data");
      setActiveSubmenu("comments");
    } else if (path === "post-fb") {
      setActiveMenu("post");
      setActiveSubmenu(subPath || "create");
    } else if (path === "post") {
      setActiveMenu("post");
      setActiveSubmenu(subPath || "create");
    } else if (path === "reports") {
      setActiveMenu("reports");
      setActiveSubmenu(subPath || "sales");
    } else if (path === "settings") {
      setActiveMenu("settings");
      setActiveSubmenu(subPath || "general");
    }
  }, [pathname]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <Header activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} activeSubmenu={activeSubmenu} />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto pb-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
