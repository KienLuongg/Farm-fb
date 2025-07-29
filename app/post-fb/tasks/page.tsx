"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import {
  TaskResponse,
  CreateTaskRequest,
} from "../../../service/facebook-poster.service";
import facebookPosterService from "../../../service/facebook-poster.service";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [startingTasks, setStartingTasks] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState<CreateTaskRequest>({
    group_url: "",
    group_name: "",
    content: "",
    total_posts: 1,
    min_delay_minutes: 10,
    max_delay_minutes: 30,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await facebookPosterService.getTasks();
      setTasks(tasksData);
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải danh sách tasks");
      }
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "total_posts" ||
        name === "min_delay_minutes" ||
        name === "max_delay_minutes"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingTask(true);
      const newTask = await facebookPosterService.createTask(formData);
      setTasks((prev) => [newTask, ...prev]);
      setShowCreateForm(false);
      setFormData({
        group_url: "",
        group_name: "",
        content: "",
        total_posts: 1,
        min_delay_minutes: 10,
        max_delay_minutes: 30,
      });
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        alert("Không thể tạo task");
      }
      console.error("Error creating task:", err);
    } finally {
      setCreatingTask(false);
    }
  };

  const handleStartTask = async (taskId: number) => {
    try {
      setStartingTasks((prev) => new Set(prev).add(taskId));
      await facebookPosterService.startTask(taskId);
      // Reload tasks to get updated status
      await loadTasks();
    } catch (err: any) {
      if (err.message?.includes("No access token")) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        alert("Không thể bắt đầu task");
      }
      console.error("Error starting task:", err);
    } finally {
      setStartingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "running":
        return "Đang chạy";
      case "completed":
        return "Hoàn thành";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Tasks
              </h1>
              <p className="mt-2 text-gray-600">
                Tạo và quản lý các task đăng bài tự động
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showCreateForm ? "Hủy" : "Tạo Task mới"}
            </button>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tạo Task mới
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Group (tùy chọn)
                  </label>
                  <input
                    type="text"
                    name="group_name"
                    value={formData.group_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                    placeholder="Tên group Facebook"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung bài đăng
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  placeholder="Nhập nội dung bài đăng..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tổng số bài đăng
                  </label>
                  <input
                    type="number"
                    name="total_posts"
                    value={formData.total_posts}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delay tối thiểu (phút)
                  </label>
                  <input
                    type="number"
                    name="min_delay_minutes"
                    value={formData.min_delay_minutes}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delay tối đa (phút)
                  </label>
                  <input
                    type="number"
                    name="max_delay_minutes"
                    value={formData.max_delay_minutes}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingTask ? "Đang tạo..." : "Tạo Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách Tasks ({tasks.length})
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
          ) : tasks.length === 0 ? (
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-500">Chưa có task nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Tạo task đầu tiên để bắt đầu đăng bài tự động
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {task.group_name || task.group_url}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusText(task.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {task.content.length > 100
                          ? task.content.substring(0, 100) + "..."
                          : task.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          📝 {task.posts_completed}/{task.total_posts} bài đã
                          đăng
                        </span>
                        <span>
                          ⏰ Delay: {task.min_delay_minutes}-
                          {task.max_delay_minutes} phút
                        </span>
                        <span>📅 Tạo: {formatDate(task.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {task.status === "pending" && (
                        <button
                          onClick={() => handleStartTask(task.id)}
                          disabled={startingTasks.has(task.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {startingTasks.has(task.id)
                            ? "Đang bắt đầu..."
                            : "Bắt đầu"}
                        </button>
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
