"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { UserInfo, UserInfoStats } from "../../service/users.service";
import userInfoService from "../../service/users.service";

export default function UsersPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [stats, setStats] = useState<UserInfoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userInfoService.getUserInfos();
      setUsers(usersData);
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải danh sách users");
      }
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await userInfoService.getUserInfoStats();
      setStats(statsData);
    } catch (err: any) {
      console.error("Error loading stats:", err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm("Bạn có chắc muốn xóa user info này?")) {
      try {
        await userInfoService.deleteUserInfo(userId);
        setUsers((users) => users.filter((user) => user.id !== userId));
        // Reload stats after deletion
        loadStats();
      } catch (err: any) {
        if (err.message?.includes("No access token")) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          alert("Không thể xóa user info");
        }
        console.error("Error deleting user info:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-2 text-gray-600">
              Danh sách thông tin người dùng đã được crawl
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thống kê
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total_users}
                </div>
                <div className="text-sm text-blue-600">Tổng users</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.verified_users}
                </div>
                <div className="text-sm text-green-600">Verified users</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.business_accounts}
                </div>
                <div className="text-sm text-purple-600">Business accounts</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {stats.regular_users}
                </div>
                <div className="text-sm text-gray-600">Regular users</div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Users ({users.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Chưa có users nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Hãy crawl target pages để có dữ liệu users
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {user.full_name}
                        </h3>
                        {user.is_verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ✓ Verified
                          </span>
                        )}
                        {user.is_business_account && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            🏢 Business
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        {user.email && <div>📧 {user.email}</div>}
                        {user.phone_number && <div>📱 {user.phone_number}</div>}
                        {user.location && <div>📍 {user.location}</div>}
                        {user.bio && <div>📝 {user.bio}</div>}
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>👥 {user.friends_count} friends</span>
                        <span>📝 {user.posts_count} posts</span>
                        <span>📸 {user.photos_count} photos</span>
                        {user.profile_url && (
                          <a
                            href={user.profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Xem profile
                          </a>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-400">
                        Crawled: {formatDate(user.crawled_at)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
