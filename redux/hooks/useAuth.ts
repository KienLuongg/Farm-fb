import { useAppDispatch, useAppSelector } from "../hooks";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logout,
  clearError,
} from "../slices/authSlice";
import type { LoginRequest, RegisterRequest } from "../../service";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginRequest) => {
    return await dispatch(loginUser(credentials));
  };

  const register = async (userData: RegisterRequest) => {
    return await dispatch(registerUser(userData));
  };

  const getCurrentUserData = async () => {
    return await dispatch(getCurrentUser());
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,

    // Actions
    login,
    register,
    getCurrentUserData,
    logoutUser,
    clearAuthError,
  };
};
