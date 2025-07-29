"use client";

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Comment } from "../../service/comments.service";
import commentsService from "../../service/comments.service";

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentsService.getComments();
      setComments(commentsData);
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải danh sách comments");
      }
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (confirm("Bạn có chắc muốn xóa comment này?")) {
      try {
        await commentsService.deleteComment(commentId);
        setComments((comments) =>
          comments.filter((comment) => comment.id !== commentId)
        );
      } catch (err: any) {
        if (err.message?.includes("No access token")) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          alert("Không thể xóa comment");
        }
        console.error("Error deleting comment:", err);
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
            <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
            <p className="mt-2 text-gray-600">
              Danh sách các bình luận đã được crawl
            </p>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
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
          ) : comments.length === 0 ? (
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Chưa có comments nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Hãy crawl target pages để có dữ liệu comments
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {comment.author_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.posted_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {truncateText(comment.content)}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>❤️ {comment.likes_count}</span>
                        <span>📝 Post ID: {comment.post_id}</span>
                        {comment.author_profile_url && (
                          <a
                            href={comment.author_profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Xem profile
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
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
