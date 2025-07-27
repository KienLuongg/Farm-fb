"use client";

import { useState } from "react";
import Layout from "../components/Layout";

interface CrawlResult {
  id: string;
  url: string;
  keyword: string;
  status: "pending" | "running" | "completed" | "failed";
  results: number;
  timestamp: string;
}

export default function CrawlDataPage() {
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate inputs
    if (!url.trim()) {
      setError("Vui lòng nhập URL");
      setIsLoading(false);
      return;
    }

    if (!keywords.trim()) {
      setError("Vui lòng nhập từ khóa");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate crawling process
      const newCrawl: CrawlResult = {
        id: Date.now().toString(),
        url: url.trim(),
        keyword: keywords.trim(),
        status: "pending",
        results: 0,
        timestamp: new Date().toLocaleString("vi-VN"),
      };

      setCrawlResults((prev) => [newCrawl, ...prev]);

      // Simulate crawling process
      setTimeout(() => {
        setCrawlResults((prev) =>
          prev.map((item) =>
            item.id === newCrawl.id
              ? { ...item, status: "running" as const }
              : item
          )
        );

        setTimeout(() => {
          setCrawlResults((prev) =>
            prev.map((item) =>
              item.id === newCrawl.id
                ? {
                    ...item,
                    status: "completed" as const,
                    results: Math.floor(Math.random() * 100) + 10,
                  }
                : item
            )
          );
        }, 2000);
      }, 1000);

      // Reset form
      setUrl("");
      setKeywords("");
    } catch (err) {
      setError("Có lỗi xảy ra khi bắt đầu craw data");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: CrawlResult["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: CrawlResult["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "running":
        return "Đang craw";
      case "completed":
        return "Hoàn thành";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">Craw Data</h1>
          <p className="mt-2 text-gray-600">
            Thu thập dữ liệu từ website theo URL và từ khóa
          </p>
        </div>

        {/* Crawl Form */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thêm tác vụ craw mới
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input */}
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL/Website
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="https://example.com"
                required
              />
            </div>

            {/* Keywords Input */}
            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Từ khóa (phân cách bằng dấu phẩy)
              </label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="nông sản, rau củ, trái cây"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Nhập các từ khóa cần tìm kiếm, phân cách bằng dấu phẩy
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xử lý..." : "Bắt đầu Craw"}
              </button>
            </div>
          </form>
        </div>

        {/* Crawl Results */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lịch sử Craw Data
          </h2>

          {crawlResults.length === 0 ? (
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Chưa có tác vụ craw nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Từ khóa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kết quả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {crawlResults.map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {result.url}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {result.keyword}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            result.status
                          )}`}
                        >
                          {getStatusText(result.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.status === "completed"
                          ? `${result.results} kết quả`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
