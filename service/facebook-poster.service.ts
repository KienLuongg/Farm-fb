import apiClient from "./axios";

// Types
export interface PostRequest {
  group_url: string;
  content: string;
}

export interface PostResponse {
  status: string;
  message: string;
  group_url: string;
  posted_at?: string;
}

export interface CreateTaskRequest {
  group_url: string;
  group_name: string;
  content: string;
  total_posts: number;
  min_delay_minutes: number;
  max_delay_minutes: number;
}

export interface TaskResponse {
  id: number;
  user_id: number;
  group_url: string;
  group_name: string;
  content: string;
  total_posts: number;
  posts_completed: number;
  min_delay_minutes: number;
  max_delay_minutes: number;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StartTaskRequest {
  task_id: number;
}

export interface StartTaskResponse {
  message: string;
  task_id: number;
}

export interface HistoryItem {
  id: number;
  task_id?: number;
  user_id: number;
  group_url: string;
  content: string;
  post_url?: string;
  status: string;
  error_message?: string;
  posted_at?: string;
  created_at: string;
}

class FacebookPosterService {
  // Test Facebook connection
  async testConnection(): Promise<{ status: string; message: string }> {
    const response = await apiClient.post("/facebook-poster/test-connection");
    return response.data;
  }

  // Create single post
  async createPost(postData: PostRequest): Promise<PostResponse> {
    const response = await apiClient.post("/facebook-poster/post", postData);
    return response.data;
  }

  // Create posting task
  async createTask(taskData: CreateTaskRequest): Promise<TaskResponse> {
    const response = await apiClient.post("/facebook-poster/tasks", taskData);
    return response.data;
  }

  // Get all tasks
  async getTasks(): Promise<TaskResponse[]> {
    const response = await apiClient.get("/facebook-poster/tasks");
    return response.data;
  }

  // Get task by ID
  async getTask(taskId: number): Promise<TaskResponse> {
    const response = await apiClient.get(`/facebook-poster/tasks/${taskId}`);
    return response.data;
  }

  // Start task
  async startTask(taskId: number): Promise<StartTaskResponse> {
    const response = await apiClient.post("/facebook-poster/tasks/start", {
      task_id: taskId,
    });
    return response.data;
  }

  // Get posting history
  async getHistory(): Promise<HistoryItem[]> {
    const response = await apiClient.get("/facebook-poster/history");
    return response.data;
  }
}

export default new FacebookPosterService();
