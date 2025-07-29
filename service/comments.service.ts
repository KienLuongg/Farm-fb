import apiClient from "./axios";

// Types
export interface Comment {
  id: number;
  post_id: number;
  comment_id: string;
  content: string;
  author_name: string;
  author_id: string;
  author_profile_url: string;
  likes_count: number;
  posted_at: string;
  crawled_at: string;
}

class CommentsService {
  // Get all comments for current user
  async getComments(): Promise<Comment[]> {
    const response = await apiClient.get("/comments", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get comment by ID
  async getComment(commentId: number): Promise<Comment> {
    const response = await apiClient.get(`/comments/${commentId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Delete comment
  async deleteComment(commentId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/comments/${commentId}`, {
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

export default new CommentsService();
