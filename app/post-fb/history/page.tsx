"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { HistoryItem } from "../../../service/facebook-poster.service";
import facebookPosterService from "../../../service/facebook-poster.service";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await facebookPosterService.getHistory();
      setHistory(historyData);
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải lịch sử đăng bài");
      }
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "error":
        return "Thất bại";
      case "pending":
        return "Đang chờ";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStats = () => {
    const total = history.length;
    const success = history.filter((item) => item.status === "success").length;
    const error = history.filter((item) => item.status === "error").length;
    const pending = history.filter((item) => item.status === "pending").length;

    return { total, success, error, pending };
  };

  const stats = getStats();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử đăng bài</h1>
          <p className="mt-2 text-gray-600">
            Xem lại tất cả các bài đăng đã thực hiện
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Tổng số bài</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.success}
              </p>
              <p className="text-sm text-gray-600">Thành công</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              <p className="text-sm text-gray-600">Thất bại</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-600">Đang chờ</p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách lịch sử ({history.length})
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
          ) : history.length === 0 ? (
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Chưa có lịch sử đăng bài</p>
              <p className="text-sm text-gray-400 mt-1">
                Bắt đầu đăng bài để xem lịch sử
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                        {item.task_id && (
                          <span className="text-xs text-gray-500">
                            Task #{item.task_id}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {truncateText(item.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📝 Group: {item.group_url}</span>
                        {item.posted_at && (
                          <span>📅 Đăng: {formatDate(item.posted_at)}</span>
                        )}
                        <span>📅 Tạo: {formatDate(item.created_at)}</span>
                      </div>
                      {item.error_message && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          <strong>Lỗi:</strong> {item.error_message}
                        </div>
                      )}
                      {item.post_url && (
                        <div className="mt-2">
                          <a
                            href={item.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Xem bài đăng →
                          </a>
                        </div>
                      )}
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
