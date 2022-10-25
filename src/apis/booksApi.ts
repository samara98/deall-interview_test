import { AxiosRequestConfig } from 'axios';
import { serverApi } from './_serverApi';

export interface Book {
  id: number;
  title: string;
  category_id: number;
  authors: string[];
  cover_url: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
  audio_length: number;
}

export const getBookList = (
  config: AxiosRequestConfig = { params: { categoryId: 1, size: 10, page: 0 } },
) => serverApi.get<Book[]>('/fee-assessment-books', config);
