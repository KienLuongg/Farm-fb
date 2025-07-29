"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import { PostRequest } from "../../service/facebook-poster.service";
import facebookPosterService from "../../service/facebook-poster.service";

export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    message: string;
    group_url?: string;
    posted_at?: string;
  } | null>(null);
  const [formData, setFormData] = useState<PostRequest>({
    group_url: "",
    content: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const response = await facebookPosterService.createPost(formData);
      setResult(response);

      if (response.status === "success") {
        // Reset form on success
        setFormData({
          group_url: "",
          content: "",
        });
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Tạo bài đăng</h1>
          <p className="mt-2 text-gray-600">
            Đăng bài đơn lẻ lên Facebook group
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Post */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tạo bài đăng mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Group URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Group Facebook
                </label>
                <input
                  type="url"
                  name="group_url"
                  value={formData.group_url}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="https://facebook.com/groups/example"
                />
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung bài đăng
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="Nhập nội dung bài đăng..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng...
                    </div>
                  ) : (
                    "Đăng bài"
                  )}
                </button>
              </div>
            </form>

            {/* Result */}
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
                      ? "Đăng bài thành công"
                      : "Đăng bài thất bại"}
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
                {result.status === "success" && result.posted_at && (
                  <p className="mt-1 text-xs text-green-600">
                    Đăng lúc:{" "}
                    {new Date(result.posted_at).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hướng dẫn sử dụng
            </h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  1. URL Group Facebook
                </h3>
                <p>Nhập URL của group Facebook bạn muốn đăng bài. Ví dụ:</p>
                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                  https://facebook.com/groups/example
                </code>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  2. Nội dung bài đăng
                </h3>
                <p>Viết nội dung bài đăng. Bạn có thể sử dụng:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Text thông thường</li>
                  <li>Emoji và biểu tượng</li>
                  <li>Link (sẽ được tự động nhận diện)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  3. Lưu ý quan trọng
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Đảm bảo đã đăng nhập Facebook trên trình duyệt</li>
                  <li>Kiểm tra kết nối internet ổn định</li>
                  <li>URL group phải chính xác và có thể truy cập</li>
                  <li>Nội dung không vi phạm chính sách Facebook</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">💡 Mẹo</h3>
                <p className="text-blue-800 text-sm">
                  Trước khi đăng bài, hãy test kết nối Facebook ở menu "Test kết
                  nối" để đảm bảo mọi thứ hoạt động tốt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
