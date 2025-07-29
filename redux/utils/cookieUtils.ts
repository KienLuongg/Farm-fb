import Cookies from "js-cookie";

// Cookie utility functions using js-cookie
export const setCookie = (
  name: string,
  value: string,
  days: number = 7
): void => {
  Cookies.set(name, value, {
    expires: days,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const getCookie = (name: string): string | null => {
  return Cookies.get(name) || null;
};

export const deleteCookie = (name: string): void => {
  Cookies.remove(name);
};

// Auth specific cookie functions
export const setAuthToken = (token: string): void => {
  setCookie("access_token", token, 7); // 7 days
};

export const getAuthToken = (): string | null => {
  return getCookie("access_token");
};

export const removeAuthToken = (): void => {
  deleteCookie("access_token");
};

// User cookie functions
export const setUserData = (user: any): void => {
  setCookie("user_data", JSON.stringify(user), 7);
};

export const getUserData = (): any | null => {
  const userData = getCookie("user_data");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeUserData = (): void => {
  deleteCookie("user_data");
};
