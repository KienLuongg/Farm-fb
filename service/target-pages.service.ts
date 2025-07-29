import apiClient from "./axios";

// Types
export interface TargetPage {
  id: number;
  user_id: number;
  page_url: string;
  page_name: string;
  page_type: string;
  description?: string;
  keywords?: string;
  max_posts: number;
  created_at: string;
  updated_at: string;
}

export interface TargetPageCreate {
  page_url: string;
  page_name: string;
  page_type: string;
  description?: string;
  keywords?: string;
  max_posts: number;
}

export interface TargetPageUpdate {
  page_url?: string;
  page_name?: string;
  page_type?: string;
  description?: string;
  keywords?: string;
  max_posts?: number;
}

class TargetPagesService {
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

  // Get all target pages for current user
  async getTargetPages(): Promise<TargetPage[]> {
    const response = await apiClient.get("/target-pages", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get target page by ID
  async getTargetPage(pageId: number): Promise<TargetPage> {
    const response = await apiClient.get(`/target-pages/${pageId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Create new target page
  async createTargetPage(pageData: TargetPageCreate): Promise<TargetPage> {
    const response = await apiClient.post("/target-pages", pageData, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Update target page
  async updateTargetPage(
    pageId: number,
    pageData: TargetPageUpdate
  ): Promise<TargetPage> {
    const response = await apiClient.put(`/target-pages/${pageId}`, pageData, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Delete target page
  async deleteTargetPage(pageId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/target-pages/${pageId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export default new TargetPagesService();
