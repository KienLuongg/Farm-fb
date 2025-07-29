"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import targetPagesService, {
  TargetPageCreate,
} from "../../../service/target-pages.service";
import Link from "next/link";

export default function AddTargetPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TargetPageCreate>({
    page_url: "",
    page_name: "",
    page_type: "facebook_group",
    description: "",
    keywords: "",
    max_posts: 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await targetPagesService.createTargetPage(formData);
      router.push("/craw-data");
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tạo target page. Vui lòng thử lại.");
      }
      console.error("Error creating target page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_posts" ? parseInt(value) : value,
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/craw-data"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Thêm Target Page
              </h1>
              <p className="mt-2 text-gray-600">
                Thêm trang đích mới để thu thập dữ liệu
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Page URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL trang đích *
              </label>
              <input
                type="url"
                name="page_url"
                value={formData.page_url}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="https://facebook.com/groups/example"
              />
              <p className="mt-1 text-sm text-gray-500">
                Nhập URL của Facebook Group, Facebook Page hoặc Website
              </p>
            </div>

            {/* Page Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên trang đích *
              </label>
              <input
                type="text"
                name="page_name"
                value={formData.page_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="Tên hiển thị cho trang đích"
              />
            </div>

            {/* Page Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại trang *
              </label>
              <select
                name="page_type"
                value={formData.page_type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
              >
                <option value="facebook_group">Facebook Group</option>
                <option value="facebook_page">Facebook Page</option>
                <option value="website">Website</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="Mô tả về trang đích này"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ khóa
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                placeholder="Từ khóa tìm kiếm, phân cách bằng dấu phẩy"
              />
              <p className="mt-1 text-sm text-gray-500">
                Các từ khóa để lọc nội dung khi crawl
              </p>
            </div>

            {/* Max Posts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng bài đăng tối đa *
              </label>
              <input
                type="number"
                name="max_posts"
                value={formData.max_posts}
                onChange={handleInputChange}
                required
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
              />
              <p className="mt-1 text-sm text-gray-500">
                Số lượng bài đăng tối đa sẽ được crawl từ trang này
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/craw-data"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tạo...
                  </div>
                ) : (
                  "Tạo Target Page"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
