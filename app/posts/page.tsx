"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Post } from "../../service/posts.service";
import postsService from "../../service/posts.service";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await postsService.getPosts();
      setPosts(postsData);
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải danh sách posts");
      }
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (confirm("Bạn có chắc muốn xóa post này?")) {
      try {
        await postsService.deletePost(postId);
        setPosts((posts) => posts.filter((post) => post.id !== postId));
      } catch (err: any) {
        if (err.message?.includes("No access token")) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          alert("Không thể xóa post");
        }
        console.error("Error deleting post:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
            <p className="mt-2 text-gray-600">
              Danh sách các bài đăng đã được crawl
            </p>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Posts ({posts.length})
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
          ) : posts.length === 0 ? (
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
              <p className="text-gray-500">Chưa có posts nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Hãy crawl target pages để có dữ liệu posts
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {post.author_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(post.posted_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {truncateText(post.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>❤️ {post.likes_count}</span>
                        <span>💬 {post.comments_count}</span>
                        <span>📤 {post.shares_count}</span>
                        {post.post_url && (
                          <a
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Xem gốc
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDeletePost(post.id)}
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
