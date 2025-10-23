// types/common/base-api.ts
export interface IBaseResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  }
  
  export interface IBaseListResponse<T> extends IBaseResponse<T[]> {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }