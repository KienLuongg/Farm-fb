import apiClient from "./axios";

// Types
export interface Post {
  id: number;
  target_page_id: number;
  post_id: string;
  post_url: string;
  author_name: string;
  author_id: string;
  content: string;
  content_embedding?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  posted_at: string;
  crawled_at: string;
}

class PostsService {
  // Get all posts for current user
  async getPosts(): Promise<Post[]> {
    const response = await apiClient.get("/posts", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get post by ID
  async getPost(postId: number): Promise<Post> {
    const response = await apiClient.get(`/posts/${postId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Delete post
  async deletePost(postId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/posts/${postId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Helper method to get auth headers
  private getAuthHeaders() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      throw new Error("No access token found. Please login again.");
    }
    return { Authorization: `Bearer ${token}` };
  }
}

export default new PostsService();
