// Export all services
export { default as authService } from "./auth.service";
export { default as userInfoService } from "./users.service";
export { default as targetPagesService } from "./target-pages.service";
export { default as crawlerService } from "./crawler.service";
export { default as postsService } from "./posts.service";
export { default as commentsService } from "./comments.service";
export { default as facebookPosterService } from "./facebook-poster.service";

// Export types
export type {
  LoginRequest,
  RegisterRequest,
  User,
  TokenResponse,
  AuthResponse,
} from "./auth.service";

export type { UserInfo, UserInfoStats } from "./users.service";

export type {
  TargetPage,
  TargetPageCreate,
  TargetPageUpdate,
} from "./target-pages.service";

export type { CrawlerResponse } from "./crawler.service";

export type { Post } from "./posts.service";

export type { Comment } from "./comments.service";

export type {
  PostRequest,
  PostResponse,
  CreateTaskRequest,
  TaskResponse,
  StartTaskRequest,
  StartTaskResponse,
  HistoryItem,
} from "./facebook-poster.service";
