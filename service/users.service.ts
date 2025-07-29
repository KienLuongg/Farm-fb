import apiClient from "./axios";

// Types
export interface UserInfo {
  id: number;
  comment_id: number;
  facebook_user_id: string;
  system_user_id: number;
  profile_url: string;
  full_name: string;
  phone_number: string;
  email: string;
  location: string;
  bio: string;
  friends_count: number;
  posts_count: number;
  photos_count: number;
  is_verified: boolean;
  is_business_account: boolean;
  business_name: string;
  business_category: string;
  crawled_at: string;
}

export interface UserInfoStats {
  total_users: number;
  verified_users: number;
  business_accounts: number;
  regular_users: number;
}

class UserInfoService {
  // Get all user info for current user
  async getUserInfos(): Promise<UserInfo[]> {
    const response = await apiClient.get("/user-info", {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get user info by ID
  async getUserInfo(userInfoId: number): Promise<UserInfo> {
    const response = await apiClient.get(`/user-info/${userInfoId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Delete user info
  async deleteUserInfo(userInfoId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/user-info/${userInfoId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Get user info statistics
  async getUserInfoStats(): Promise<UserInfoStats> {
    const response = await apiClient.get("/user-info/stats/summary", {
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

export default new UserInfoService();
