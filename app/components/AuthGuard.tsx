"use client";

import { useEffect } from "react";
import { useAuth } from "../../redux/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, loading, getCurrentUserData } = useAuth();

  useEffect(() => {
    // Try to get current user if we have a token but no user data
    if (!loading && !isAuthenticated) {
      getCurrentUserData();
    }
  }, [isAuthenticated, loading, getCurrentUserData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">Please login to access this page.</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
