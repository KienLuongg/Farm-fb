"use client";

import { useState } from "react";
import Layout from "../../components/Layout";
import facebookPosterService from "../../../service/facebook-poster.service";

export default function TestConnectionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    message: string;
  } | null>(null);

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setResult(null);
      const response = await facebookPosterService.testConnection();
      setResult(response);
    } catch (err: any) {
      setResult({
        status: "error",
        message:
          err.response?.data?.detail || err.message || "Lỗi không xác định",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Test Kết nối Facebook
          </h1>
          <p className="mt-2 text-gray-600">
            Kiểm tra kết nối với Facebook để đảm bảo có thể đăng bài
          </p>
        </div>

        {/* Test Connection */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Kiểm tra kết nối
          </h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              Nhấn nút bên dưới để kiểm tra kết nối với Facebook. Hệ thống sẽ
              xác minh xem có thể đăng bài lên Facebook groups hay không.
            </p>

            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang kiểm tra...
                </div>
              ) : (
                "Test Kết nối"
              )}
            </button>

            {result && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center">
                  {result.status === "success" ? (
                    <svg
                      className="w-5 h-5 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <span
                    className={`font-medium ${
                      result.status === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {result.status === "success"
                      ? "Kết nối thành công"
                      : "Kết nối thất bại"}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    result.status === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {result.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Hướng dẫn
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Đảm bảo đã đăng nhập Facebook trên trình duyệt</p>
            <p>• Kiểm tra kết nối internet ổn định</p>
            <p>• Nếu test thất bại, hãy thử đăng nhập lại Facebook</p>
            <p>• Test này sẽ kiểm tra khả năng truy cập Facebook groups</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
