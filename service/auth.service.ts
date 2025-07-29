import apiClient from "./axios";

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Backend sử dụng OAuth2PasswordRequestForm nên cần gửi form data
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    // Gọi API login thật - backend trả về { access_token, token_type }
    const response = await apiClient.post("/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { access_token, token_type } = response.data;

    // Lưu token thật vào localStorage
    localStorage.setItem("access_token", access_token);

    // Tạo user object từ credentials (không gọi API /auth/me)
    const user: User = {
      id: 0, // Sẽ được cập nhật khi cần
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      full_name: credentials.username,
      is_active: true,
      is_admin: credentials.username === "admin",
      created_at: new Date().toISOString(),
    };

    // Lưu user vào localStorage
    localStorage.setItem("user", JSON.stringify(user));

    return {
      user,
      token: access_token,
    };
  }

  // Register
  async register(userData: RegisterRequest): Promise<User> {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Logout
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem("access_token");
  }
}

export default new AuthService();
