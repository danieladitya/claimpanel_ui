export interface Pagination {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
    has_previous: boolean;
    has_next: boolean;
  }