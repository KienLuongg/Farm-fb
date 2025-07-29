"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { TargetPage } from "../../service/target-pages.service";
import targetPagesService from "../../service/target-pages.service";
import crawlerService from "../../service/crawler.service";
import Link from "next/link";

export default function CrawDataPage() {
  const [targetPages, setTargetPages] = useState<TargetPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [crawlingPages, setCrawlingPages] = useState<Set<number>>(new Set());
  const [crawlResults, setCrawlResults] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    loadTargetPages();
  }, []);

  const loadTargetPages = async () => {
    try {
      setLoading(true);
      const pages = await targetPagesService.getTargetPages();
      setTargetPages(pages);
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải danh sách target pages");
      }
      console.error("Error loading target pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (confirm("Bạn có chắc muốn xóa target page này?")) {
      try {
        await targetPagesService.deleteTargetPage(pageId);
        setTargetPages((pages) => pages.filter((page) => page.id !== pageId));
      } catch (err: any) {
        if (err.message?.includes("No access token")) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          alert("Không thể xóa target page");
        }
        console.error("Error deleting target page:", err);
      }
    }
  };

  const handleStartCrawling = async (pageId: number) => {
    if (confirm("Bạn có chắc muốn bắt đầu crawl trang này?")) {
      try {
        setCrawlingPages((prev) => new Set(prev).add(pageId));

        const result = await crawlerService.startCrawling(pageId);

        setCrawlResults((prev) => ({
          ...prev,
          [pageId]: result,
        }));

        alert(
          `Crawl hoàn thành!\n- Posts: ${result.result.posts_crawled}\n- Comments: ${result.result.comments_crawled}\n- Users: ${result.result.users_crawled}`
        );
      } catch (err: any) {
        if (err.message?.includes("No access token")) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          alert("Không thể bắt đầu crawl. Vui lòng thử lại.");
        }
        console.error("Error starting crawler:", err);
      } finally {
        setCrawlingPages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(pageId);
          return newSet;
        });
      }
    }
  };

  const getStatusColor = (pageType: string) => {
    switch (pageType.toLowerCase()) {
      case "facebook_group":
        return "bg-blue-100 text-blue-800";
      case "facebook_page":
        return "bg-green-100 text-green-800";
      case "website":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (pageType: string) => {
    switch (pageType.toLowerCase()) {
      case "facebook_group":
        return "Facebook Group";
      case "facebook_page":
        return "Facebook Page";
      case "website":
        return "Website";
      default:
        return pageType;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Craw Data</h1>
              <p className="mt-2 text-gray-600">
                Quản lý việc thu thập dữ liệu từ các nguồn khác nhau
              </p>
            </div>
            <Link
              href="/craw-data/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thêm Target Page
            </Link>
          </div>
        </div>

        {/* Target Pages Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Target Pages ({targetPages.length})
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
          ) : targetPages.length === 0 ? (
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
              <p className="text-gray-500">Chưa có target page nào</p>
              <Link
                href="/craw-data/add"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Thêm target page đầu tiên
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {targetPages.map((page) => (
                <div
                  key={page.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {page.page_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 break-all">
                        {page.page_url}
                      </p>
                      {page.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {page.description}
                        </p>
                      )}
                      <div className="flex items-center mt-2 space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            page.page_type
                          )}`}
                        >
                          {getStatusText(page.page_type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Max: {page.max_posts} posts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleStartCrawling(page.id)}
                        disabled={crawlingPages.has(page.id)}
                        className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {crawlingPages.has(page.id) ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                            Crawling...
                          </div>
                        ) : (
                          "Crawl"
                        )}
                      </button>
                      <Link
                        href={`/craw-data/edit/${page.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDeletePage(page.id)}
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

        {/* Crawling History Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Crawling History
          </h2>
          <div className="space-y-3">
            {Object.keys(crawlResults).length === 0 ? (
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
                <p className="text-gray-500">Chưa có lịch sử crawl nào</p>
                <p className="text-sm text-gray-400 mt-1">
                  Bấm nút "Crawl" trên target page để bắt đầu
                </p>
              </div>
            ) : (
              Object.entries(crawlResults).map(([pageId, result]) => {
                const page = targetPages.find((p) => p.id === parseInt(pageId));
                return (
                  <div
                    key={pageId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {page?.page_name || `Page ${pageId}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Posts: {result.result.posts_crawled} | Comments:{" "}
                        {result.result.comments_crawled} | Users:{" "}
                        {result.result.users_crawled}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex space-x-4">
            <Link
              href="/craw-data/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add New Target
            </Link>
            <button
              onClick={() => {
                if (targetPages.length === 0) {
                  alert("Không có target page nào để crawl");
                  return;
                }
                if (
                  confirm(
                    `Bạn có chắc muốn crawl tất cả ${targetPages.length} target pages?`
                  )
                ) {
                  targetPages.forEach((page) => {
                    if (!crawlingPages.has(page.id)) {
                      handleStartCrawling(page.id);
                    }
                  });
                }
              }}
              disabled={targetPages.length === 0 || crawlingPages.size > 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {crawlingPages.size > 0
                ? `Crawling ${crawlingPages.size} pages...`
                : "Start All Crawling"}
            </button>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
