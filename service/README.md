# API Services Documentation

Cấu trúc services để gọi API từ backend (farm) vào frontend (farm-fb).

## Cấu trúc thư mục

```
service/
├── axios/
│   └── index.ts          # Cấu hình axios chung
├── auth.service.ts       # Authentication service
├── users.service.ts      # Users management service
├── target-pages.service.ts # Target pages service
├── crawler.service.ts    # Crawler service
├── posts.service.ts      # Posts service
├── comments.service.ts   # Comments service
├── facebook-poster.service.ts # Facebook poster service
├── index.ts             # Export tất cả services
└── README.md           # Documentation này
```

## Cách sử dụng

### 1. Import services

```typescript
import {
  authService,
  usersService,
  targetPagesService,
  crawlerService,
  postsService,
  commentsService,
  facebookPosterService,
} from "@/service";
```

### 2. Authentication Service

```typescript
// Login
const loginResult = await authService.login({
  username: "user123",
  password: "password123",
});

// Register
const user = await authService.register({
  username: "newuser",
  email: "user@example.com",
  password: "password123",
  full_name: "New User",
});

// Get current user
const currentUser = await authService.getCurrentUser();

// Logout
authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();
```

### 3. Users Service

```typescript
// Get all users (Admin only)
const users = await usersService.getUsers();

// Get user by ID (Admin only)
const user = await usersService.getUserById(1);

// Create user (Admin only)
const newUser = await usersService.createUser({
  username: "newuser",
  email: "user@example.com",
  password: "password123",
  full_name: "New User",
});

// Update user (Admin only)
const updatedUser = await usersService.updateUser(1, {
  full_name: "Updated Name",
});

// Delete user (Admin only)
await usersService.deleteUser(1);

// Get my profile
const myProfile = await usersService.getMyProfile();

// Update my profile
const updatedProfile = await usersService.updateMyProfile({
  full_name: "New Name",
});
```

### 4. Target Pages Service

```typescript
// Get all target pages
const pages = await targetPagesService.getTargetPages();

// Get target page by ID
const page = await targetPagesService.getTargetPage(1);

// Create target page
const newPage = await targetPagesService.createTargetPage({
  page_url: "https://facebook.com/group123",
  page_name: "My Group",
  page_type: "group",
  description: "Test group",
  keywords: "test, group",
  max_posts: 100,
});

// Update target page
const updatedPage = await targetPagesService.updateTargetPage(1, {
  page_name: "Updated Group Name",
});

// Delete target page
await targetPagesService.deleteTargetPage(1);
```

### 5. Crawler Service

```typescript
// Start crawling a target page
const result = await crawlerService.startCrawling(1);
```

### 6. Posts Service

```typescript
// Get all posts
const posts = await postsService.getPosts();

// Get post by ID
const post = await postsService.getPost(1);

// Delete post
await postsService.deletePost(1);
```

### 7. Comments Service

```typescript
// Get all comments
const comments = await commentsService.getComments();

// Get comment by ID
const comment = await commentsService.getComment(1);

// Delete comment
await commentsService.deleteComment(1);
```

### 8. Facebook Poster Service

```typescript
// Test Facebook connection
const connectionTest = await facebookPosterService.testConnection();

// Create single post
const postResult = await facebookPosterService.createPost({
  group_url: "https://facebook.com/groups/123",
  content: "Hello world!",
});

// Create posting task
const task = await facebookPosterService.createTask({
  group_url: "https://facebook.com/groups/123",
  group_name: "Test Group",
  content: "Test post content",
  total_posts: 10,
  min_delay_minutes: 5,
  max_delay_minutes: 15,
});

// Get all tasks
const tasks = await facebookPosterService.getTasks();

// Get task by ID
const taskDetail = await facebookPosterService.getTask(1);

// Start task
const startResult = await facebookPosterService.startTask(1);

// Get posting history
const history = await facebookPosterService.getHistory();
```

## Cấu hình

### Environment Variables

Tạo file `.env.local` trong thư mục `farm-fb`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Base URL

Mặc định API sẽ chạy trên `http://localhost:8000/api`. Bạn có thể thay đổi bằng cách set environment variable `NEXT_PUBLIC_API_URL`.

## Error Handling

Tất cả services đều có error handling tự động:

- Lỗi 401 (Unauthorized): Tự động logout và redirect về trang login
- Lỗi network: Throw error để component có thể handle
- Token expired: Tự động clear localStorage

## Authentication Flow

1. User login → Lưu token vào localStorage
2. Tất cả requests tự động thêm Authorization header
3. Nếu token expired → Tự động logout và redirect
4. User logout → Clear localStorage

## TypeScript Support

Tất cả services đều có TypeScript types đầy đủ. Import types từ service tương ứng:

```typescript
import type { User, LoginRequest } from "@/service";
```
