# Redux Authentication Setup

Cấu trúc Redux để quản lý authentication state với cookie storage.

## Cấu trúc thư mục

```
redux/
├── store.ts              # Redux store configuration
├── provider.tsx          # Redux provider component
├── hooks.ts              # Typed hooks
├── hooks/
│   └── useAuth.ts        # Custom auth hook
├── slices/
│   └── authSlice.ts      # Auth slice với async thunks
├── utils/
│   └── cookieUtils.ts    # Cookie utility functions
└── README.md            # Documentation này
```

## Features

- ✅ Authentication state management
- ✅ Cookie storage cho token và user data
- ✅ Auto-login từ cookie
- ✅ Loading states
- ✅ Error handling
- ✅ TypeScript support
- ✅ Async thunks cho API calls

## Cách sử dụng

### 1. Setup Provider

Đã được setup trong `app/layout.tsx`:

```tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2. Sử dụng trong Components

```tsx
import { useAuth } from "@/redux/hooks/useAuth";

export const MyComponent = () => {
  const { user, isAuthenticated, loading, error, login, logoutUser } =
    useAuth();

  const handleLogin = async () => {
    await login({ username: "user", password: "pass" });
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome, {user?.full_name}!</div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### 3. Auth Guard Component

```tsx
import { AuthGuard } from "@/app/components/AuthGuard";

export const ProtectedPage = () => {
  return (
    <AuthGuard>
      <div>This is a protected page</div>
    </AuthGuard>
  );
};
```

### 4. Login Form

```tsx
import { LoginForm } from "@/app/components/LoginForm";

export const LoginPage = () => {
  return <LoginForm />;
};
```

### 5. User Profile

```tsx
import { UserProfile } from "@/app/components/UserProfile";

export const ProfilePage = () => {
  return <UserProfile />;
};
```

## State Structure

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

## Actions

### Async Thunks

- `loginUser(credentials)` - Login user
- `registerUser(userData)` - Register user
- `getCurrentUser()` - Get current user data

### Sync Actions

- `setUser(user)` - Set user data
- `setToken(token)` - Set token
- `logout()` - Logout user
- `clearError()` - Clear error
- `setLoading(loading)` - Set loading state

## Cookie Management

### Token Cookie

- **Name**: `access_token`
- **Expires**: 7 days
- **Secure**: true in production
- **SameSite**: strict

### User Data Cookie

- **Name**: `user_data`
- **Expires**: 7 days
- **Secure**: true in production
- **SameSite**: strict

## Auto-login Flow

1. App khởi động
2. Redux load initial state từ cookies
3. Nếu có token và user data → set authenticated
4. Nếu chỉ có token → gọi API để get user data
5. Nếu không có token → redirect to login

## Error Handling

- Network errors được catch và hiển thị
- 401 errors tự động logout
- Loading states cho UX tốt hơn

## TypeScript Support

Tất cả đều có TypeScript types đầy đủ:

```typescript
import type { User, LoginRequest } from "@/service";
import type { AuthState } from "@/redux/slices/authSlice";
```

## Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Security Features

- ✅ Secure cookies in production
- ✅ SameSite strict
- ✅ Token expiration handling
- ✅ Auto logout on 401
- ✅ CSRF protection via SameSite

## Example Usage

### Login Page

```tsx
"use client";

import { LoginForm } from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

### Protected Dashboard

```tsx
"use client";

import { AuthGuard } from "@/app/components/AuthGuard";
import { UserProfile } from "@/app/components/UserProfile";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <UserProfile />
      </div>
    </AuthGuard>
  );
}
```

### Navigation Component

```tsx
"use client";

import { useAuth } from "@/redux/hooks/useAuth";

export const Navigation = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">My App</h1>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span>Welcome, {user?.full_name}</span>
                <button
                  onClick={logoutUser}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
```
