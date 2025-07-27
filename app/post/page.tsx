"use client";

import { useState } from "react";
import Layout from "../components/Layout";

interface PostData {
  id: string;
  pageUrl: string;
  content: string;
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledTime?: string;
  createdAt: string;
}

export default function PostPage() {
  const [pageUrl, setPageUrl] = useState("");
  const [content, setContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate inputs
    if (!pageUrl.trim()) {
      setError("Vui lòng nhập link Fanpage/Group Facebook");
      setIsLoading(false);
      return;
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bài đăng");
      setIsLoading(false);
      return;
    }

    // Validate Facebook URL
    if (!pageUrl.includes("facebook.com")) {
      setError("Vui lòng nhập link Facebook hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      const newPost: PostData = {
        id: Date.now().toString(),
        pageUrl: pageUrl.trim(),
        content: content.trim(),
        status: scheduledTime ? "scheduled" : "draft",
        scheduledTime: scheduledTime || undefined,
        createdAt: new Date().toLocaleString("vi-VN"),
      };

      setPosts((prev) => [newPost, ...prev]);
      setSuccess("Bài đăng đã được tạo thành công!");

      // Reset form
      setPageUrl("");
      setContent("");
      setScheduledTime("");
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: PostData["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: PostData["status"]) => {
    switch (status) {
      case "draft":
        return "Bản nháp";
      case "scheduled":
        return "Đã lên lịch";
      case "published":
        return "Đã đăng";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const handlePublish = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, status: "published" as const } : post
      )
    );
    setSuccess("Bài đăng đã được đăng thành công!");
  };

  return (
    <Layout>
      <div className="space-y-6 pb-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Đăng bài</h1>
          <p className="mt-2 text-gray-600">
            Tạo và đăng bài lên Fanpage/Group Facebook
          </p>
        </div>

        {/* Post Form */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tạo bài đăng mới
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Facebook URL Input */}
            <div>
              <label
                htmlFor="pageUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Link Fanpage/Group Facebook
              </label>
              <input
                id="pageUrl"
                type="url"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="https://www.facebook.com/groups/example hoặc https://www.facebook.com/fanpage"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Nhập link Fanpage hoặc Group Facebook nơi bạn muốn đăng bài
              </p>
            </div>

            {/* Content Input */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nội dung bài đăng
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-vertical"
                placeholder="Viết nội dung bài đăng của bạn ở đây..."
                required
              />
              <div className="mt-1 flex justify-between items-center">
                <p className="text-sm text-gray-500">{content.length} ký tự</p>
                <p className="text-sm text-gray-500">Giới hạn: 63,206 ký tự</p>
              </div>
            </div>

            {/* Schedule Option */}
            <div>
              <label
                htmlFor="scheduledTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Lên lịch đăng bài (tùy chọn)
              </label>
              <input
                id="scheduledTime"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <p className="mt-1 text-sm text-gray-500">
                Để trống để lưu bản nháp hoặc chọn thời gian để lên lịch đăng
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Đang xử lý..."
                  : scheduledTime
                  ? "Lên lịch đăng"
                  : "Lưu bản nháp"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPageUrl("");
                  setContent("");
                  setScheduledTime("");
                  setError("");
                  setSuccess("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Làm mới
              </button>
            </div>
          </form>
        </div>

        {/* Posts History */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lịch sử bài đăng
          </h2>

          {posts.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Chưa có bài đăng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {post.pageUrl}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {post.content.length > 100
                          ? `${post.content.substring(0, 100)}...`
                          : post.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {getStatusText(post.status)}
                      </span>
                      {post.status === "draft" && (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Đăng ngay
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Tạo lúc: {post.createdAt}</span>
                    {post.scheduledTime && (
                      <span>
                        Lên lịch:{" "}
                        {new Date(post.scheduledTime).toLocaleString("vi-VN")}
                      </span>
                    )}
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
