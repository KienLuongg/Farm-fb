"use client";

import { useAuth } from "../../redux/hooks/useAuth";

export const UserProfile = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.username}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.full_name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {user.is_admin ? "Admin" : "User"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {user.is_active ? "Active" : "Inactive"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Created At
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={logoutUser}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
