"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../components/Layout";
import targetPagesService, {
  TargetPage,
  TargetPageUpdate,
} from "../../../../service/target-pages.service";
import Link from "next/link";

export default function EditTargetPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<TargetPage | null>(null);
  const [formData, setFormData] = useState<TargetPageUpdate>({
    page_url: "",
    page_name: "",
    page_type: "facebook_group",
    description: "",
    keywords: "",
    max_posts: 100,
  });

  useEffect(() => {
    loadTargetPage();
  }, [pageId]);

  const loadTargetPage = async () => {
    try {
      setLoading(true);
      const targetPage = await targetPagesService.getTargetPage(pageId);
      setPage(targetPage);
      setFormData({
        page_url: targetPage.page_url,
        page_name: targetPage.page_name,
        page_type: targetPage.page_type,
        description: targetPage.description || "",
        keywords: targetPage.keywords || "",
        max_posts: targetPage.max_posts,
      });
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải thông tin target page");
      }
      console.error("Error loading target page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await targetPagesService.updateTargetPage(pageId, formData);
      router.push("/craw-data");
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể cập nhật target page. Vui lòng thử lại.");
      }
      console.error("Error updating target page:", err);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !page) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-red-600">{error}</p>
              <Link
                href="/craw-data"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
                Chỉnh sửa Target Page
              </h1>
              <p className="mt-2 text-gray-600">
                Cập nhật thông tin trang đích
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
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
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
                    Đang cập nhật...
                  </div>
                ) : (
                  "Cập nhật Target Page"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
