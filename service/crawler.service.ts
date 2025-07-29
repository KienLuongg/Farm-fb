import apiClient from "./axios";

// Types
export interface CrawlerResponse {
  message: string;
  target_page_id: number;
  target_page_name: string;
  result: {
    success: boolean;
    target_page_id: number;
    target_page_name: string;
    posts_crawled: number;
    comments_crawled: number;
    users_crawled: number;
    files_generated: {
      posts_txt: string | null;
      posts_json: string | null;
      detailed_posts_json: string | null;
      users_json: string | null;
      comments_json: string | null;
    };
    error?: string;
  };
}

class CrawlerService {
  // Start crawling a specific target page
  async startCrawling(targetPageId: number): Promise<CrawlerResponse> {
    const response = await apiClient.post(
      `/crawler/start/${targetPageId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export default new CrawlerService();
